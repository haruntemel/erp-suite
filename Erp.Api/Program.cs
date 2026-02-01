using Erp.Api.Data;
using Erp.Api.Models;
using Erp.Api.Services;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EFCore.NamingConventions;
using BCrypt.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// 🔹 CONFIGURATION LOGGING
// =============================================
Console.WriteLine("\n=== CONFIGURATION CHECK ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");

// =============================================
// 🔹 EF Core - PostgreSQL
// =============================================
// Docker'da environment variable ConnectionStrings__DefaultConnection
// appsettings.json'daki değeri OVERRIDE eder -> her iki ortamda da çalışır
var connStr = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connStr}");

builder.Services.AddDbContext<ErpDbContext>(options =>
    options.UseNpgsql(connStr)
           .UseSnakeCaseNamingConvention());

// =============================================
// 🔹 CORS
// =============================================
// FIX: Production'da nginx proxy kullandığımız için "*" yeterli
// Local dev için spesifik portlar
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", p =>
        p.WithOrigins(
            "http://localhost:5173",   // Vite dev server
            "http://localhost:3000",   // React dev / Docker frontend
            "http://localhost:5000"    // Backend doğrudan
        )
         .AllowAnyHeader()
         .AllowAnyMethod());

    // Production: nginx aynı origin'den serve ettiği için bu yeterli
    options.AddPolicy("Production", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// =============================================
// 🔹 OData EDM Model
// =============================================
var edmBuilder = new ODataConventionModelBuilder();
edmBuilder.EntitySet<Product>("Products");

// =============================================
// 🔹 JWT CONFIGURATION
// =============================================
var jwt = builder.Configuration.GetSection("Jwt");
// FIX: Key her zaman config'den gelsin -> GenerateSecureKey REMOVE edildi
// Çünkü her restart'ta farklı key üretirse token geçersiz olur
var keyString = jwt["Key"]
    ?? throw new ArgumentNullException("Jwt:Key", "JWT Key configuration is missing!");

Console.WriteLine($"\n=== JWT CONFIGURATION ===");
Console.WriteLine($"Key length: {keyString.Length} chars | {Encoding.UTF8.GetBytes(keyString).Length * 8} bits");
Console.WriteLine($"Issuer: {jwt["Issuer"]}");
Console.WriteLine($"Audience: {jwt["Audience"]}");

// Key 32 char (256 bit) altında olursa uygulama başlatmayı durdur
if (keyString.Length < 32)
{
    throw new InvalidOperationException(
        $"JWT Key çok kısa! Mevcut: {keyString.Length} char. " +
        $"En az 32 char (256 bit) olmalı. " +
        $"appsettings.json'daki Jwt.Key'i uzatlın.");
}

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
Console.WriteLine($"✅ JWT Key OK - SecurityKey: {key.KeySize} bits");

// JWT Authentication
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
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.Zero
        };

        opt.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"❌ JWT Auth Failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine($"✅ JWT Token Validated");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

// =============================================
// 🔹 Controllers + OData + JSON
// =============================================
builder.Services.AddControllers()
    .AddOData(opt =>
    {
        opt.AddRouteComponents("odata", edmBuilder.GetEdmModel());
        opt.Select().Filter().OrderBy().Expand().SetMaxTop(100).Count();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new NullableDateOnlyJsonConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// =============================================
// 🔹 APP BUILD
// =============================================
var app = builder.Build();

// =============================================
// 🔹 DATABASE SEED
// =============================================
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ErpDbContext>();

        Console.WriteLine("\n=== DATABASE SETUP ===");
        // EnsureCreatedAsync -> tabloları oluşturur (migration olmadan)
        // Dikkat: Varolan tablolar üzerinde schema değişikliği yapmazs
        // Eğer schema değiştiysen -> tabloyu silmen veya migration kullanman gerekir
        await db.Database.EnsureCreatedAsync();
        Console.WriteLine("✅ Database tables ensured");

        // Admin kullanıcı kontrolü
        var adminUser = await db.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == "admin");

        if (adminUser == null)
        {
            // Role oluştur
            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
            {
                adminRole = new Role { Name = "Admin" };
                db.Roles.Add(adminRole);
                await db.SaveChangesAsync();
                Console.WriteLine($"✅ Admin role created (ID: {adminRole.Id})");
            }

            // Admin user oluştur
            adminUser = new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("12345"),
                RoleId = adminRole.Id,
                Status = true
            };

            db.Users.Add(adminUser);
            await db.SaveChangesAsync();
            Console.WriteLine("✅ Admin user created (username: admin, password: 12345)");
        }
        else
        {
            // Varolan admin -> şifre doğrulama
            bool passwordOk = BCrypt.Net.BCrypt.Verify("12345", adminUser.PasswordHash ?? "");
            if (!passwordOk)
            {
                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("12345");
                await db.SaveChangesAsync();
                Console.WriteLine("⚠️  Admin password hash updated");
            }
            else
            {
                Console.WriteLine("✅ Admin user exists, password OK");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ DATABASE SEED ERROR: {ex.Message}");
        if (ex.InnerException != null)
            Console.WriteLine($"   Inner: {ex.InnerException.Message}");
    }
}

// =============================================
// 🔹 MIDDLEWARE PIPELINE
// =============================================
// FIX: Environment'a göre CORS policy seç
if (app.Environment.IsProduction())
    app.UseCors("Production");
else
    app.UseCors("FrontendDev");

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// =============================================
// 🔹 STARTUP LOG
// =============================================
Console.WriteLine("\n=== APPLICATION STARTED ===");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"Listening on: http://0.0.0.0:80 (container) | http://localhost:5000 (host)");
Console.WriteLine("Press Ctrl+C to stop\n");

// FIX: Container'da 0.0.0.0:80 dinle -> Dockerfile EXPOSE 80 ile uyumlu
// Environment variable ile override edilebilir
app.Run();

// =============================================
// JSON Converters
// =============================================
public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string Format = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return string.IsNullOrEmpty(value) ? default : DateOnly.Parse(value);
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(Format));
    }
}

public class NullableDateOnlyJsonConverter : JsonConverter<DateOnly?>
{
    private const string Format = "yyyy-MM-dd";

    public override DateOnly? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var str = reader.GetString();
        return string.IsNullOrEmpty(str) ? null : DateOnly.Parse(str);
    }

    public override void Write(Utf8JsonWriter writer, DateOnly? value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value?.ToString(Format));
    }
}