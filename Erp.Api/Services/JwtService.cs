using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Erp.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace Erp.Api.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            try
            {
                Console.WriteLine($"\n=== GENERATING TOKEN ===");
                
                var jwt = _configuration.GetSection("Jwt");
                var key = jwt["Key"] ?? throw new ArgumentNullException("Jwt:Key");
                var issuer = jwt["Issuer"] ?? "erp-api";
                var audience = jwt["Audience"] ?? "erp-client";
                var expireMinutes = jwt["ExpireMinutes"] ?? "60";
                
                // DEBUG: Key uzunluğunu kontrol et
                Console.WriteLine($"JWT Key length: {key.Length} characters");
                Console.WriteLine($"Key bits: {Encoding.UTF8.GetBytes(key).Length * 8} bits");
                
                if (string.IsNullOrEmpty(key) || key.Length < 32)
                {
                    throw new ArgumentException($"JWT Key must be at least 32 characters. Current: {key?.Length}");
                }
                
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                
                // Claims oluştur
                var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Username),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    new Claim("userId", user.Id.ToString()),
    new Claim("username", user.Username),
    new Claim("roleId", user.RoleId?.ToString() ?? "0"),
    new Claim("role", user.Role?.Name ?? "admin") 
};
                
                // Token oluştur
                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(Convert.ToDouble(expireMinutes)),
                    signingCredentials: credentials
                );
                
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                
                Console.WriteLine($"✅ Token generated successfully!");
                Console.WriteLine($"Token length: {tokenString.Length} characters");
                
                return tokenString;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n❌ TOKEN GENERATION ERROR:");
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                throw;
            }
        }
    }
}