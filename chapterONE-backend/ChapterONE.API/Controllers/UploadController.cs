using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _context;

        public UploadController(IWebHostEnvironment env, AppDbContext context)
        {
            _env = env;
            _context = context;
        }

        [HttpPost("profile-picture/{userId}")]
        public async Task<IActionResult> UploadProfilePicture(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Nenhum ficheiro recebido.");
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var url = await SaveFile(file, "uploads/profiles");
            user.ProfilePicture = url;
            await _context.SaveChangesAsync();
            return Ok(new { url });
        }

        [HttpPost("project-cover/{projectId}")]
        public async Task<IActionResult> UploadProjectCover(int projectId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Nenhum ficheiro recebido.");
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return NotFound();

            var url = await SaveFile(file, "uploads/covers");
            project.CoverImage = url;
            await _context.SaveChangesAsync();
            return Ok(new { url });
        }

        [HttpPost("chapter-image")]
        public async Task<IActionResult> UploadChapterImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum ficheiro recebido.");

            var url = await SaveFile(file, "uploads/chapter-images");
            return Ok(new { url });
        }

        [HttpPost("reference-image/{referenceId}")]
        public async Task<IActionResult> UploadReferenceImage(int referenceId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Nenhum ficheiro recebido.");
            var reference = await _context.References.FindAsync(referenceId);
            if (reference == null) return NotFound();

            var url = await SaveFile(file, "uploads/references");
            reference.ImageUrl = url;
            await _context.SaveChangesAsync();
            return Ok(new { url });
        }

        private async Task<string> SaveFile(IFormFile file, string folder)
        {
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                throw new InvalidOperationException("Tipo de ficheiro não suportado.");

            var uploadPath = Path.Combine(_env.WebRootPath, folder);
            Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/{folder}/{fileName}";
        }
    }
}
