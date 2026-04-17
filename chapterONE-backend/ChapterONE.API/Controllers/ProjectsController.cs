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
                .Where(p => p.OwnerId == ownerId)
                .ToListAsync();

            foreach (var project in projects)
            {
                project.Chapters = project.Chapters.OrderBy(c => c.Order).ToList();
            }

            return projects;
        }

        //detalhes de um project
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Chapters)
                .Include(p => p.Collaborators)
                .FirstOrDefaultAsync(p => p.Id == id);

            if(project == null) return NotFound();
            return project;
        }

        //criar novo projeto
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            project.CreationDate = DateTime.Now;
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        //apagar um project
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
