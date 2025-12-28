using Erp.Api.Data;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EFCore.NamingConventions;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// 🔹 EF Core PostgreSQL
builder.Services.AddDbContext<ErpDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());

// 🔹 CORS (React dev server için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", p =>
        p.WithOrigins("http://localhost:5173", "http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// 🔹 OData EDM Model
var edmBuilder = new ODataConventionModelBuilder();
edmBuilder.EntitySet<Erp.Api.Models.Product>("Products");
var hash = BCrypt.Net.BCrypt.HashPassword("12345");
        Console.WriteLine(hash);

// 🔹 JWT
var jwt = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"] ?? "ChangeMe_32+Chars"));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = key
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

// 🔹 Controller + OData
builder.Services.AddControllers()
    .AddOData(opt =>
    {
        opt.AddRouteComponents("odata", edmBuilder.GetEdmModel());
        opt.Select().Filter().OrderBy().Expand().SetMaxTop(100).Count();
    });

var app = builder.Build();

// --- HASH TEST (geçici) ---
string testHash = "$2a$06$srF3e0A2XlstDHs1UV7fv.eLokrDackLXYWM2HDQ6Z4rgIhKIC05y";
bool isValid = BCrypt.Net.BCrypt.Verify("12345", testHash);
Console.WriteLine("12345 doğrulandı mı? " + isValid);
// --- HASH TEST SON ---

app.UseCors("FrontendDev");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
