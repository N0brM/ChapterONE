using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;
using ChapterONE.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollaboratorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CollaboratorsController(AppDbContext context)
        {
            _context = context;
        }

        //+ gajos pro project
        [HttpPost]
        public async Task<IActionResult> AddCollaborator(ProjectCollaborator collaborator)
        {
            if (await _context.ProjectCollaborators.AnyAsync(pc => pc.ProjectId == collaborator.ProjectId && pc.UserId == collaborator.UserId)) 
            {
                return BadRequest("Já é colaborador neste projeto");
            }

            _context.ProjectCollaborators.Add(collaborator);
            await _context.SaveChangesAsync();

            return Ok("Adicionado com sucesso");
        }

        //- socios no project
        [HttpDelete("project/{projectId}/user/{userId}")]
        public async Task<IActionResult> RemoveCollaborator(int projectId, int userId)
        {
            var collaborator = await _context.ProjectCollaborators
                .FirstOrDefaultAsync(pc => pc.ProjectId == projectId && pc.UserId == userId);

            if (collaborator == null)
            {
                return NotFound();
            }

            _context.ProjectCollaborators.Remove(collaborator);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
