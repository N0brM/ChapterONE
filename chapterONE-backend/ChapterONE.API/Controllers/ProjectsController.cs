using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;
using ChapterONE.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{ownerId}")]
        public async Task<ActionResult<IEnumerable<Project>>> GetUserProjects(int ownerId)
        {
            var projects = await _context.Projects
                .Include(p => p.Chapters)
                .Include(p => p.Collaborators)
                .Where(p => p.OwnerId == ownerId || p.Collaborators.Any(c => c.UserId == ownerId))
                .ToListAsync();

            foreach (var project in projects)
            {
                project.Chapters = project.Chapters.OrderBy(c => c.Order).ToList();
            }

            return projects;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Chapters)
                .Include(p => p.Collaborators)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            project.Chapters = project.Chapters.OrderBy(c => c.Order).ToList();
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            project.CreationDate = DateTime.Now;
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project project)
        {
            if (id != project.Id) return BadRequest();

            var existing = await _context.Projects.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = project.Title;
            existing.Description = project.Description;
            existing.CoverColor = project.CoverColor;
            existing.CoverImage = project.CoverImage;
            existing.ProjectType = project.ProjectType;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(p => p.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}