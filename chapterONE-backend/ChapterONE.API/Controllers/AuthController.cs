using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChapterONE.API.Data;
using ChapterONE.API.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace ChapterONE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _Context;

        public AuthController(AppDbContext context)
        {
            _Context = context;
        }

        //Este aqui serve para o register de um socio novo
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user) 
        {
            if(await _Context.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email)) 
            {
                return BadRequest("O Utilizador ou Email já existem");
            }

            //transformar a pass em hash
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.PasswordHash = passwordHash;

            _Context.Users.Add(user);
            await _Context.SaveChangesAsync();

            return Ok("Utilizador registado com sucesso");
        }

        //este aqui é pro login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginRequest loginDto)
        {
            var user = await _Context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null)
            {
                return BadRequest("Utilizador não encontrado");
            }

            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash);
            if (!isPasswordCorrect)
            {
                return BadRequest("Palavra-passe incorreta");
            }

            return Ok(new
            {
                userId = user.Id,
                username = user.Username,
                profilePicture = user.ProfilePicture
            });
        }
    }
}
