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
        private const string GeminiModel = "gemini-2.5-flash";
        private const string GeminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

        public AIController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("analyze")]
        public async Task<ActionResult> AnalyzeText([FromBody] TextRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("O texto não pode estar vazio.");

            request.Text = SanitizeEditorHtml(request.Text);
            var wordCount = CountWords(request.Text);
            var sentenceCount = CountSentences(request.Text);
            var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));

            var prompt =
                "Analisa este texto em português. " +
                "Responde EXCLUSIVAMENTE com um objeto JSON, sem qualquer texto antes ou depois, sem markdown, sem ```.\n" +
                "O objeto deve ter exactamente estas duas propriedades:\n" +
                "{ \"predominantEmotion\": \"<emoção em português: Alegria, Tristeza, Tensão, Medo, Esperança, Raiva, Nostalgia, Suspense, Romance, Humor...>\", " +
                "\"readingLevel\": \"<Infantil | Juvenil | Adulto | Académico>\" }\n\n" +
                $"Texto:\n{TruncateText(request.Text, 3000)}";

            string predominantEmotion = "Neutro";
            string readingLevel = "Geral";

            try
            {
                var aiResponse = await CallGemini(prompt, maxTokens: 512);
                Console.WriteLine($"[AI Analyze] Resposta bruta do Gemini: '{aiResponse}'");

                var jsonMatch = Regex.Match(aiResponse, @"\{.*?\}", RegexOptions.Singleline);
                if (!jsonMatch.Success)
                    throw new Exception($"Nenhum JSON encontrado na resposta: {aiResponse}");

                Console.WriteLine($"[AI Analyze] JSON extraído: '{jsonMatch.Value}'");

                var parsed = JsonSerializer.Deserialize<JsonElement>(jsonMatch.Value);
                predominantEmotion = parsed.GetProperty("predominantEmotion").GetString() ?? "Neutro";
                readingLevel = parsed.GetProperty("readingLevel").GetString() ?? "Geral";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI Analyze] ERRO: {ex.Message}");
            }

            return Ok(new
            {
                WordCount = wordCount,
                SentenceCount = sentenceCount,
                ReadingTimeMinutes = readingTime,
                PredominantEmotion = predominantEmotion,
                ReadingLevel = readingLevel,
            });
        }

        [HttpPost("improve")]
        public async Task<ActionResult> ImproveText([FromBody] ImproveRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("O texto não pode estar vazio.");
            request.Text = SanitizeEditorHtml(request.Text);

            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("O texto ficou vazio após sanitização.");


            var systemPrompt = request.Type switch
            {
                "grammar" =>
                    "És um revisor de textos especializado em português europeu. " +
                    "A tua tarefa é APENAS corrigir erros gramaticais, ortográficos e de pontuação. " +
                    "Não alteres o estilo, o vocabulário nem a estrutura das frases do autor. " +
                    "Preserva todas as tags HTML existentes no texto (como <b>, <i>, <u>, <font>, etc.). " +
                    "Devolve APENAS o texto corrigido, sem explicações, sem comentários, sem markdown.",

                "vocabulary" =>
                    "És um especialista em língua portuguesa europeia. " +
                    "A tua tarefa é melhorar o vocabulário do texto, substituindo palavras repetidas, " +
                    "genéricas ou simples por alternativas mais ricas, precisas e expressivas. " +
                    "Mantém o tom e o estilo do autor. " +
                    "Preserva todas as tags HTML existentes no texto. " +
                    "Devolve APENAS o texto melhorado, sem explicações, sem comentários, sem markdown.",

                "style" =>
                    "És um editor literário especializado em português europeu. " +
                    "A tua tarefa é melhorar a fluidez e expressividade do texto, " +
                    "tornando as frases mais dinâmicas e o ritmo mais agradável de ler. " +
                    "Preserva a voz e as intenções do autor. " +
                    "Preserva todas as tags HTML existentes no texto. " +
                    "Devolve APENAS o texto melhorado, sem explicações, sem comentários, sem markdown.",

                _ => "Melhora este texto em português europeu. Devolve apenas o texto melhorado."
            };

            try
            {
                var improved = await CallGemini(
                    $"Texto original:\n\n{TruncateText(request.Text, 6000)}",
                    systemPrompt,
                    maxTokens: 4096
                );
                return Ok(new { ImprovedText = improved });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AI Improve] Erro: {ex.Message}");
                return StatusCode(500, "Erro ao contactar a IA.");
            }
        }

        private async Task<string> CallGemini(string userMessage, string? systemPrompt = null, int maxTokens = 512)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("Chave da API Gemini não configurada em appsettings.json.");

            var requestObj = new Dictionary<string, object>
            {
                ["contents"] = new[]
                {
                    new
                    {
                        parts = new[] { new { text = userMessage } }
                    }
                },
                ["generationConfig"] = new
                {
                    maxOutputTokens = maxTokens
                }
            };

            if (!string.IsNullOrEmpty(systemPrompt))
            {
                requestObj["systemInstruction"] = new
                {
                    parts = new[] { new { text = systemPrompt } }
                };
            }

            var json = JsonSerializer.Serialize(requestObj);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            var url = $"{GeminiApiBaseUrl}/{GeminiModel}:generateContent?key={apiKey}";

            var response = await _httpClient.PostAsync(url, content);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Gemini API erro {response.StatusCode}: {body}");

            var parsed = JsonSerializer.Deserialize<JsonElement>(body);

            try
            {
                var candidates = parsed.GetProperty("candidates");
                var firstCandidate = candidates[0];
                var contentNode = firstCandidate.GetProperty("content");
                var parts = contentNode.GetProperty("parts");

                return parts[0].GetProperty("text").GetString() ?? "";
            }
            catch (Exception)
            {
                throw new Exception($"Não foi possível ler a estrutura de resposta do Gemini. Resposta crua: {body}");
            }
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
            return Regex.Matches(clean, @"[.!?]+").Count is 0 ? 1 : Regex.Matches(clean, @"[.!?]+").Count;
        }

        private static string TruncateText(string text, int maxChars)
            => text.Length <= maxChars ? text : text[..maxChars] + "...";

        private static string SanitizeEditorHtml(string html)
        {
            var cleaned = Regex.Replace(html, @" _ngcontent-[^""]*""[^""]*""", "");
            cleaned = Regex.Replace(cleaned, @" data-[a-z\-]+=(?:""[^""]*""|'[^']*')", "");
            cleaned = Regex.Replace(cleaned, @" aria-[a-z\-]+=(?:""[^""]*""|'[^']*')", "");
            cleaned = Regex.Replace(cleaned, @" role=""[^""]*""", "");
            cleaned = Regex.Replace(cleaned, @" id=""[^""]*""", "");
            cleaned = Regex.Replace(cleaned, @" class=""[^""]*""", "");
            cleaned = Regex.Replace(cleaned, @" style=""[^""]*""", "");
            cleaned = Regex.Replace(cleaned, @" c=""[^""]*""", ""); 

            var allowedTags = new HashSet<string> { "p", "b", "i", "u", "strong", "em", "br", "span", "font", "h1", "h2", "h3", "h4", "ul", "ol", "li" };
            cleaned = Regex.Replace(cleaned, @"<(/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>", m =>
            {
                var tag = m.Groups[2].Value.ToLower();
                return allowedTags.Contains(tag) ? $"<{m.Groups[1].Value}{tag}>" : " ";
            });

            cleaned = Regex.Replace(cleaned, @"\s{2,}", " ").Trim();
            return cleaned;
        }
    }

    public class TextRequest
    {
        public string Text { get; set; } = string.Empty;
    }

    public class ImproveRequest
    {
        public string Text { get; set; } = string.Empty;
        // "grammar" | "vocabulary" | "style"
        public string Type { get; set; } = "grammar";
    }
}