using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChapterONE.API.Data;
using ChapterONE.API.Models;

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

        [HttpGet("{projectId}")]
        public async Task<ActionResult> GetCollaborators(int projectId)
        {
            var collaborators = await _context.ProjectCollaborators
                .Where(c => c.ProjectId == projectId)
                .Include(c => c.User)
                .Select(c => new
                {
                    c.UserId,
                    c.User!.Username,
                    c.User.ProfilePicture,
                    c.Role,
                })
                .ToListAsync();

            return Ok(collaborators);
        }

        [HttpPost("add-by-username")]
        public async Task<ActionResult> AddByUsername([FromBody] AddByUsernameRequest request)
        {
            // Valida que o projeto existe e que quem pede é o dono
            var project = await _context.Projects.FindAsync(request.ProjectId);
            if (project == null) return NotFound("Projeto não encontrado.");
            if (project.OwnerId != request.RequestingUserId)
                return Forbid();

            // Procura o utilizador pelo username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                return NotFound($"Utilizador '{request.Username}' não encontrado.");

            // Não pode adicionar o próprio dono
            if (user.Id == project.OwnerId)
                return BadRequest("O dono do projeto não pode ser adicionado como colaborador.");

            // Verifica se já é colaborador
            var exists = await _context.ProjectCollaborators
                .AnyAsync(c => c.ProjectId == request.ProjectId && c.UserId == user.Id);
            if (exists)
                return BadRequest($"'{request.Username}' já é colaborador deste projeto.");

            var collab = new ProjectCollaborator
            {
                ProjectId = request.ProjectId,
                UserId = user.Id,
                Role = "Editor",
            };
            _context.ProjectCollaborators.Add(collab);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.ProfilePicture,
                Role = "Editor",
            });
        }

        [HttpPost("join")]
        public async Task<ActionResult> JoinByCode([FromBody] JoinByCodeRequest request)
        {
            // Procura o projeto pelo código (case-insensitive)
            var project = await _context.Projects
                .Include(p => p.Collaborators)
                .FirstOrDefaultAsync(p => p.InviteCode.ToUpper() == request.Code.ToUpper());

            if (project == null)
                return NotFound("Código de convite inválido ou expirado.");

            // Não pode ser o próprio dono
            if (project.OwnerId == request.UserId)
                return BadRequest("És o dono deste projeto — não precisas de código de convite.");

            // Verifica se já é colaborador
            var exists = await _context.ProjectCollaborators
                .AnyAsync(c => c.ProjectId == project.Id && c.UserId == request.UserId);
            if (exists)
                return BadRequest("Já és colaborador deste projeto.");

            var collab = new ProjectCollaborator
            {
                ProjectId = project.Id,
                UserId = request.UserId,
                Role = "Editor",
            };
            _context.ProjectCollaborators.Add(collab);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                project.Id,
                project.Title,
                project.CoverColor,
                project.ProjectType,
                Message = $"Entraste no projeto \"{project.Title}\" com sucesso!",
            });
        }

        [HttpDelete("{projectId}/{userId}")]
        public async Task<ActionResult> RemoveCollaborator(
            int projectId, int userId, [FromQuery] int requestingUserId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return NotFound();

            // Só o dono pode remover — ou o próprio pode sair
            if (project.OwnerId != requestingUserId && userId != requestingUserId)
                return Forbid();

            var collab = await _context.ProjectCollaborators
                .FirstOrDefaultAsync(c => c.ProjectId == projectId && c.UserId == userId);
            if (collab == null) return NotFound("Colaborador não encontrado.");

            _context.ProjectCollaborators.Remove(collab);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("regenerate-code/{projectId}")]
        public async Task<ActionResult> RegenerateCode(
            int projectId, [FromQuery] int requestingUserId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return NotFound();
            if (project.OwnerId != requestingUserId) return Forbid();

            project.InviteCode = Project.GenerateCode();
            await _context.SaveChangesAsync();

            return Ok(new { project.InviteCode });
        }
    }

    // DTOs
    public class AddByUsernameRequest
    {
        public int ProjectId { get; set; }
        public int RequestingUserId { get; set; }
        public string Username { get; set; } = string.Empty;
    }

    public class JoinByCodeRequest
    {
        public int UserId { get; set; }
        public string Code { get; set; } = string.Empty;
    }
}
