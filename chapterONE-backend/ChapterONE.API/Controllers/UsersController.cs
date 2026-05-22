using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;
using ChapterONE.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Nunca devolve a password hash ao frontend
            return new
            {
                user.Id,
                user.Username,
                user.Email,
                user.ProfilePicture,
                user.PreferredTheme,
                user.RegistrationDate
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Verificar se o username já existe noutro utilizador
            if (!string.IsNullOrEmpty(request.Username) && request.Username != user.Username)
            {
                bool usernameExists = await _context.Users
                    .AnyAsync(u => u.Username == request.Username && u.Id != id);
                if (usernameExists)
                    return BadRequest("Este nome de utilizador já está em uso.");
            }

            // Verificar se o email já existe noutro utilizador
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                bool emailExists = await _context.Users
                    .AnyAsync(u => u.Email == request.Email && u.Id != id);
                if (emailExists)
                    return BadRequest("Este email já está em uso.");
            }

            if (!string.IsNullOrEmpty(request.Username))
                user.Username = request.Username;

            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;

            if (!string.IsNullOrEmpty(request.PreferredTheme))
                user.PreferredTheme = request.PreferredTheme;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.ProfilePicture,
                user.PreferredTheme
            });
        }
    }

    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PreferredTheme { get; set; }
    }
}
