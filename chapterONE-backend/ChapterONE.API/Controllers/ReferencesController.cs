using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChapterONE.API.Data;
using ChapterONE.API.Models;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReferencesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReferencesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Reference>>> GetByProject(int projectId)
        {
            return await _context.References
                .Where(r => r.ProjectId == projectId)
                .OrderBy(r => r.Type)
                .ThenBy(r => r.Name)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Reference>> Create(Reference reference)
        {
            reference.CreatedAt = DateTime.Now;
            _context.References.Add(reference);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByProject),
                new { projectId = reference.ProjectId }, reference);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Reference reference)
        {
            if (id != reference.Id) return BadRequest();

            var existing = await _context.References.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = reference.Name;
            existing.Content = reference.Content;
            existing.Type = reference.Type;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reference = await _context.References.FindAsync(id);
            if (reference == null) return NotFound();

            _context.References.Remove(reference);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
