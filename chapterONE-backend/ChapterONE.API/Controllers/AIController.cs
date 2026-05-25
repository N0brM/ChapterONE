using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient = new HttpClient();

        private const string GeminiModel = "gemini-1.5-flash";
        private const string GeminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/";

        public AIController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // analise multilingue
        [HttpPost("analyze")]
        public async Task<ActionResult> AnalyzeText([FromBody] TextRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("O texto não pode estar vazio.");

            var wordCount = CountWords(request.Text);
            var sentenceCount = CountSentences(request.Text);
            var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));

            // Prompt atualizado para pedir a deteção de língua e tradução automática dos campos
            var prompt =
                $"Analisa o seguinte texto, deteta a sua língua e responde APENAS em JSON válido, " +
                $"com exatamente estas três propriedades (os valores das propriedades devem ser escritos na língua detetada):\n" +
                $"- \"detectedLanguage\": o nome da língua detetada por ti (ex: Português, English, Español, Français...)\n" +
                $"- \"predominantEmotion\": a emoção predominante no texto, escrita na língua detetada (ex: se for inglês escrever 'Joy' ou 'Sadness', se for português 'Alegria' ou 'Tristeza')\n" +
                $"- \"readingLevel\": o nível de leitura, escrito na língua detetada (ex: Infantil/Children, Juvenil/Youth, Adulto/Adult, Académico/Academic)\n\n" +
                $"Texto:\n{TruncateText(request.Text, 3000)}";

            string detectedLanguage = "Desconhecida";
            string predominantEmotion = "Neutro";
            string readingLevel = "Geral";

            try
            {
                var aiResponse = await CallGemini(prompt, maxTokens: 150, requiresJson: true);
                var parsed = JsonSerializer.Deserialize<JsonElement>(aiResponse);

                detectedLanguage = parsed.GetProperty("detectedLanguage").GetString() ?? "Desconhecida";
                predominantEmotion = parsed.GetProperty("predominantEmotion").GetString() ?? "Neutro";
                readingLevel = parsed.GetProperty("readingLevel").GetString() ?? "Geral";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI Analyze] Erro ao chamar Gemini: {ex.Message}");
            }

            return Ok(new
            {
                WordCount = wordCount,
                SentenceCount = sentenceCount,
                ReadingTimeMinutes = readingTime,
                DetectedLanguage = detectedLanguage,
                PredominantEmotion = predominantEmotion,
                ReadingLevel = readingLevel,
            });
        }

        // Assistente de escrita adaptável ao idioma
        [HttpPost("assist")]
        public async Task<ActionResult> AssistWriting([FromBody] AssistRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest("A pergunta não pode estar vazia.");

            var contextText = string.IsNullOrWhiteSpace(request.Text)
                ? "(sem texto de contexto)"
                : TruncateText(request.Text, 3000);

            var systemPrompt =
                "És um assistente de escrita criativa poliglota e altamente versátil. " +
                "O teu objetivo é ajudar escritores a melhorar os seus textos. " +
                "Deves detetar automaticamente o idioma do texto de contexto e/ou da pergunta do utilizador, e responder " +
                "obrigatoriamente nessa mesma língua (se o utilizador escrever em Inglês, responde em Inglês, se for em Espanhol, responde em Espanhol, etc.). " +
                "Podes fazer correções gramaticais, sugerir melhorias de estilo, dar feedback " +
                "sobre ritmo, personagens ou narrativa, e responder a qualquer dúvida sobre escrita. " +
                "Sê direto, construtivo e adapta o teu tom e formalidade às normas culturais do idioma detetado. " +
                "Quando sugeres alterações, mostra o texto original e a tua sugestão separados claramente.\n\n" +
                $"Contexto — texto atual do capítulo:\n\n{contextText}";

            try
            {
                var response = await CallGemini(request.Question, systemPrompt, maxTokens: 1024);
                return Ok(new { Response = response });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI Assist] Erro: {ex.Message}");
                return StatusCode(500, "Erro ao contactar o assistente de IA.");
            }
        }

        private async Task<string> CallGemini(string userMessage, string? systemPrompt = null, int maxTokens = 512, bool requiresJson = false)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("Chave da API Gemini não configurada em appsettings.json.");

            var requestObj = new Dictionary<string, object>
            {
                ["contents"] = new[]
                {
                    new { role = "user", parts = new[] { new { text = userMessage } } }
                },
                ["generationConfig"] = new Dictionary<string, object>
                {
                    ["maxOutputTokens"] = maxTokens
                }
            };

            if (!string.IsNullOrEmpty(systemPrompt))
            {
                requestObj["systemInstruction"] = new
                {
                    parts = new[] { new { text = systemPrompt } }
                };
            }

            if (requiresJson)
            {
                ((Dictionary<string, object>)requestObj["generationConfig"])["responseMimeType"] = "application/json";
            }

            var json = JsonSerializer.Serialize(requestObj);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var url = $"{GeminiApiBaseUrl}{GeminiModel}:generateContent?key={apiKey}";

            _httpClient.DefaultRequestHeaders.Clear();

            var httpResponse = await _httpClient.PostAsync(url, content);
            var body = await httpResponse.Content.ReadAsStringAsync();

            if (!httpResponse.IsSuccessStatusCode)
                throw new Exception($"Gemini API erro {httpResponse.StatusCode}: {body}");

            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;

            if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
            {
                var firstCandidate = candidates[0];
                if (firstCandidate.TryGetProperty("content", out var resContent) &&
                    resContent.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0)
                {
                    return parts[0].GetProperty("text").GetString() ?? "";
                }
            }

            return "";
        }

        private static int CountWords(string text)
        {
            var clean = Regex.Replace(text, "<[^>]+>", " ");
            clean = Regex.Replace(clean, @"\s+", " ").Trim();
            return string.IsNullOrEmpty(clean) ? 0 : clean.Split(' ').Length;
        }

        private static int CountSentences(string text)
        {
            var clean = Regex.Replace(text, "<[^>]+>", " ");
            var matches = Regex.Matches(clean, @"[.!?]+");
            return matches.Count == 0 ? 1 : matches.Count;
        }

        private static string TruncateText(string text, int maxChars)
            => text.Length <= maxChars ? text : text[..maxChars] + "...";
    }

    public class TextRequest
    {
        public string Text { get; set; } = string.Empty;
    }

    public class AssistRequest
    {
        public string Text { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
    }
}