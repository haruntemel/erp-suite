using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using Erp.Api.Services; // ✅ BU SATIRI EKLEYİN
using BCrypt.Net;

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
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                Console.WriteLine($"\n=== LOGIN ATTEMPT ===");
                Console.WriteLine($"Username: '{req.Username}'");
                Console.WriteLine($"Password length: {req.Password?.Length}");

                // 1. Input validation
                if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
                    return BadRequest("Username veya password boş olamaz");

                // 2. Trim ve lowercase (tutarlılık için)
                var username = req.Username.Trim().ToLower();
                
                // 3. DEBUG: Tüm kullanıcıları listele
                var allUsers = await _db.Users.ToListAsync();
                Console.WriteLine($"\n=== ALL USERS IN DATABASE ({allUsers.Count}) ===");
                foreach (var u in allUsers)
                {
                    Console.WriteLine($"- ID: {u.Id}, Username: '{u.Username}', Status: {u.Status}");
                }
                
                // 4. Kullanıcıyı bul (case-insensitive)
                var user = await _db.Users
                    .FirstOrDefaultAsync(u => u.Username.ToLower() == username);
                
                Console.WriteLine($"\n=== QUERY RESULT ===");
                Console.WriteLine($"Looking for username: '{username}'");
                Console.WriteLine($"User found: {(user != null ? "YES" : "NO")}");
                
                if (user == null)
                {
                    Console.WriteLine("ERROR: User not found in database!");
                    return Unauthorized("Kullanıcı bulunamadı");
                }
                
                Console.WriteLine($"User details - ID: {user.Id}, Username: '{user.Username}', Status: {user.Status}");
                Console.WriteLine($"PasswordHash length: {user.PasswordHash?.Length}");

                // 5. Status kontrolü
                if (user.Status != true)
                {
                    Console.WriteLine("ERROR: User is not active!");
                    return Unauthorized("Kullanıcı aktif değil");
                }

                // 6. Şifre kontrolü
                Console.WriteLine($"\n=== PASSWORD VERIFICATION ===");
                Console.WriteLine($"Input password: '{req.Password}'");
                Console.WriteLine($"Stored hash: {user.PasswordHash}");
                
                bool passwordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
                Console.WriteLine($"Password valid: {passwordValid}");
                
                if (!passwordValid)
                {
                    Console.WriteLine("ERROR: Password mismatch!");
                    return Unauthorized("Şifre hatalı");
                }

                // 7. Token oluştur
                Console.WriteLine($"\n=== TOKEN GENERATION START ===");
                var token = _jwt.GenerateToken(user);
                Console.WriteLine($"=== TOKEN GENERATION SUCCESS ===");
                
                Console.WriteLine($"\n=== LOGIN SUCCESSFUL ===");
                Console.WriteLine($"Token generated for user: {user.Username}");
                
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
            catch (Exception ex)
            {
                Console.WriteLine($"\n=== EXCEPTION ===");
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }
        
        // LoginRequest model sınıfınızı da kontrol edin
        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}