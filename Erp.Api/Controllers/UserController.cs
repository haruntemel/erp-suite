using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Erp.Api.Data;
using Erp.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Data.Common;
namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public UsersController(ErpDbContext context)
        {
            _context = context;
        }

[HttpGet]
public async Task<IActionResult> GetUsers()
{
    var users = await _context.Users.ToListAsync();

    var result = users.Select(u => new {
        u.Id,
        u.Username,
        roleId = u.RoleId,
        status = u.Status
    });

    return Ok(result);
}


        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            await _context.Database.OpenConnectionAsync();
            using var cmd = _context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "INSERT INTO users (username, password_hash, role_id, status) VALUES (@u, crypt(@p, gen_salt('bf')), @r, true)";
            cmd.Parameters.Add(new NpgsqlParameter("u", dto.Username));
            cmd.Parameters.Add(new NpgsqlParameter("p", dto.Password));
            cmd.Parameters.Add(new NpgsqlParameter("r", dto.RoleId));
            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Kullanıcı oluşturuldu" });
        }
    }

    public class CreateUserDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public int RoleId { get; set; }
    }
}