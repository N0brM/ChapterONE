using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;
using ChapterONE.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChaptersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChaptersController(AppDbContext context)
        {
            _context = context;
        }

        // sacar os chaps
        [HttpGet("{id}")]
        public async Task<ActionResult<Chapter>> GetChapter(int id)
        {
            var chapter = await _context.Chapters.FindAsync(id);

            if (chapter == null)
            {
                return NotFound();
            }

            return chapter;
        }

            
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChapter(int id, Chapter chapter)
        {
            if (id != chapter.Id)
            {
                return BadRequest();
            }
            
            if (!string.IsNullOrEmpty(chapter.Content))
            {
                // Contagem de palavras
                chapter.WordCount = chapter.Content.Split(new[] { ' ', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries).Length;

                // Calcula tempo de leitura (média de 200 palavras por minuto)
                chapter.ReadingTime = (int)Math.Ceiling(chapter.WordCount / 200.0);
            }
            else
            {
                chapter.WordCount = 0;
                chapter.ReadingTime = 0;
            }

            chapter.LastAnalysisDate = DateTime.Now;

            _context.Entry(chapter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChapterExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // meter um chap
        [HttpPost]
        public async Task<ActionResult<Chapter>> PostChapter(Chapter chapter)
        {
            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChapter), new { id = chapter.Id }, chapter);
        }

        // apagar um chap
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChapter(int id)
        {
            var chapter = await _context.Chapters.FindAsync(id);
            if (chapter == null)
            {
                return NotFound();
            }

            _context.Chapters.Remove(chapter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChapterExists(int id)
        {
            return _context.Chapters.Any(e => e.Id == id);
        }
    }
}
