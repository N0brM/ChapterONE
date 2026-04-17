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

        //mostrar os chaps de um project
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Chapter>>> GetProjectChapters(int projectId)
        {
            return await _context.Chapters
                .Where(c => c.ProjectId == projectId)
                .OrderBy(c => c.Order)
                .ToListAsync();
        }

        //meter um chap novo
        [HttpPost]
        public async Task<ActionResult> CreateChapter([FromBody] Chapter chapter)
        {
            if (string.IsNullOrEmpty(chapter.Title))
            {
                return BadRequest(new { message = "O título chegou vazio ao servidor!", recebido = chapter });
            }

            try
            {
                chapter.Project = null;
                _context.Chapters.Add(chapter);
                var result = await _context.SaveChangesAsync();

                if (result > 0) return Ok(chapter);

                return BadRequest("não conseguiu persistir os dados.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        //apagar
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
    }
}
