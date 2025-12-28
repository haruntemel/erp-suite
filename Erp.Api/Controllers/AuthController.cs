using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
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
    //Console.WriteLine($"USERNAME RAW: '{req.Username}'");
    //Console.WriteLine($"PASSWORD RAW: '{req.Password}'");

    if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
        return BadRequest("Username veya password boş olamaz");

    var username = req.Username?.Trim();
if (string.IsNullOrEmpty(username))
    return BadRequest("Username boş olamaz");



   var user = await _db.Users
    .AsNoTracking()
    .FirstOrDefaultAsync(u => u.Username == "admin");
Console.WriteLine($"USERNAME LENGTH: {username.Length}");
foreach (var c in username) Console.WriteLine($"CHAR: {(int)c}");
Console.WriteLine($"EF PARAM USERNAME: '{username}'");
Console.WriteLine($"USER FROM DB: {user?.Username}, STATUS: {user?.Status}");
if (user == null)
{
    Console.WriteLine("USER NESNESİ NULL DÖNDÜ!");
}
else
{
    Console.WriteLine($"USER FROM DB: {user.Username}, STATUS: {user.Status}");
}
Console.WriteLine($"REQ.Username: '{req.Username}'");
Console.WriteLine($"REQ.Password: '{req.Password}'");
    if (user == null)
        return Unauthorized("Kullanıcı bulunamadı");
if (user.Status != true) return Unauthorized();

if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
    return Unauthorized();

    bool verified = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
    if (!verified)
        return Unauthorized("Şifre hatalı");

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
