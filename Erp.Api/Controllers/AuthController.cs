using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ErpDbContext _db;
        private readonly JwtService _jwt;

        public AuthController(ErpDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("login")]
        [AllowAnonymous]   // 🔹 login için token gerekmesin
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            // Kullanıcıyı bul
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Username == req.Username && u.Status);

            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı");

            // Şifre doğrulama (bcrypt)
            bool verified = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
            if (!verified)
                return Unauthorized("Şifre hatalı");

            // Token üret
            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    roleId = user.RoleId
                }
            });
        }
    }
}