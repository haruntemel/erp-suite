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

// DEBUG: Configuration kontrolü
Console.WriteLine("\n=== CONFIGURATION CHECK ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");

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
edmBuilder.EntitySet<Product>("Products");

// 🔹 JWT CONFIGURATION
var jwt = builder.Configuration.GetSection("Jwt");
var keyString = jwt["Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT Key configuration is missing!");

// DEBUG: JWT ayarlarını göster
Console.WriteLine($"\n=== JWT CONFIGURATION ===");
Console.WriteLine($"Key from config: {keyString}");
Console.WriteLine($"Key length: {keyString.Length} characters");
Console.WriteLine($"Key bits: {Encoding.UTF8.GetBytes(keyString).Length * 8} bits");
Console.WriteLine($"Issuer: {jwt["Issuer"]}");
Console.WriteLine($"Audience: {jwt["Audience"]}");
Console.WriteLine($"ExpireMinutes: {jwt["ExpireMinutes"]}");

// Key uzunluğunu kontrol et (en az 32 karakter = 256 bit)
if (keyString.Length < 32)
{
    Console.WriteLine($"\n⚠️  WARNING: JWT Key is too short for HS256!");
    Console.WriteLine($"   Current: {keyString.Length} chars ({Encoding.UTF8.GetBytes(keyString).Length * 8} bits)");
    Console.WriteLine($"   Required: 32 chars (256 bits)");
    Console.WriteLine($"   Generating a secure random key...");
    
    // Güvenli random key oluştur
    keyString = GenerateSecureKey(32);
    Console.WriteLine($"   New key: {keyString}");
    Console.WriteLine($"   New key length: {keyString.Length} characters");
}
else
{
    Console.WriteLine($"\n✅ JWT Key length is OK for HS256");
}

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
Console.WriteLine($"SecurityKey length: {key.KeySize} bits");

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
            ClockSkew = TimeSpan.Zero // Token süresi hassas olsun
        };
        
        // DEBUG için
        opt.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"\n❌ JWT AUTHENTICATION FAILED:");
                Console.WriteLine($"Error: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine($"\n✅ JWT TOKEN VALIDATED");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

// 🔹 Controller + OData + JSON Serialization
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

var app = builder.Build();

// === VERİTABANI SEED İŞLEMİ ===
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ErpDbContext>();
        
        // DEBUG: Hash test
        Console.WriteLine("\n=== HASH TEST ===");
        string testPassword = "12345";
        string testHash = BCrypt.Net.BCrypt.HashPassword(testPassword);
        bool isValid = BCrypt.Net.BCrypt.Verify(testPassword, testHash);
        Console.WriteLine($"Password: {testPassword}");
        Console.WriteLine($"Hash: {testHash}");
        Console.WriteLine($"Verification: {isValid}");
        
        // Veritabanını oluştur (eğer yoksa)
        Console.WriteLine("\n=== DATABASE CREATION ===");
        await db.Database.EnsureCreatedAsync();
        Console.WriteLine("✅ Database ensured/created");
        
        // DEBUG: Mevcut kullanıcıları göster
        var userCount = await db.Users.CountAsync();
        Console.WriteLine($"\n=== DATABASE CHECK ===");
        Console.WriteLine($"Total users in database: {userCount}");
        
        // Tüm kullanıcıları listele
        var allUsers = await db.Users.ToListAsync();
        if (allUsers.Any())
        {
            Console.WriteLine("\n=== EXISTING USERS ===");
            foreach (var user in allUsers)
            {
                Console.WriteLine($"- ID: {user.Id}, Username: '{user.Username}', Status: {user.Status}");
            }
        }
        else
        {
            Console.WriteLine("No users found in database.");
        }
        
        // Eğer admin kullanıcısı yoksa oluştur
        var adminUser = await db.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == "admin");
            
        if (adminUser == null)
        {
            Console.WriteLine("\n=== CREATING ADMIN USER ===");
            
            // Önce bir Role ekleyelim (eğer yoksa)
            var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
            {
                adminRole = new Role { Name = "Admin" };
                db.Roles.Add(adminRole);
                await db.SaveChangesAsync();
                Console.WriteLine($"✅ Admin role created with ID: {adminRole.Id}");
            }
            else
            {
                Console.WriteLine($"✅ Admin role already exists with ID: {adminRole.Id}");
            }
            
            // Admin kullanıcısını oluştur
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("12345");
            
            adminUser = new User
            {
                Username = "admin",
                PasswordHash = passwordHash,
                RoleId = adminRole.Id,
                Status = true
            };
            
            db.Users.Add(adminUser);
            await db.SaveChangesAsync();
            
            Console.WriteLine($"\n✅ ADMIN USER CREATED SUCCESSFULLY");
            Console.WriteLine($"   Username: admin");
            Console.WriteLine($"   Password: 12345");
            Console.WriteLine($"   Password Hash: {passwordHash}");
            Console.WriteLine($"   Role: Admin (ID: {adminRole.Id})");
            Console.WriteLine($"   Status: Active");
        }
        else
        {
            Console.WriteLine($"\n=== ADMIN USER ALREADY EXISTS ===");
            Console.WriteLine($"Username: {adminUser.Username}");
            Console.WriteLine($"Status: {adminUser.Status}");
            Console.WriteLine($"Role ID: {adminUser.RoleId}");
            
            // DEBUG: Şifreyi kontrol et
            if (!string.IsNullOrEmpty(adminUser.PasswordHash))
            {
                bool test = BCrypt.Net.BCrypt.Verify("12345", adminUser.PasswordHash);
                Console.WriteLine($"Password '12345' verification: {test}");
                
                // Eğer şifre yanlışsa veya hash yoksa, güncelle
                if (!test)
                {
                    Console.WriteLine("⚠️  Password hash mismatch. Updating...");
                    adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("12345");
                    await db.SaveChangesAsync();
                    Console.WriteLine("✅ Password hash updated");
                }
            }
            else
            {
                Console.WriteLine("⚠️  Password hash is empty. Setting new hash...");
                adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("12345");
                await db.SaveChangesAsync();
                Console.WriteLine("✅ Password hash set");
            }
        }
        
        // DEBUG: Son durumu göster
        Console.WriteLine($"\n=== FINAL CHECK ===");
        var finalAdmin = await db.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == "admin");
        if (finalAdmin != null)
        {
            Console.WriteLine($"Final admin user:");
            Console.WriteLine($"  ID: {finalAdmin.Id}");
            Console.WriteLine($"  Username: '{finalAdmin.Username}'");
            Console.WriteLine($"  Status: {finalAdmin.Status}");
            Console.WriteLine($"  PasswordHash exists: {!string.IsNullOrEmpty(finalAdmin.PasswordHash)}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\n❌ SEED ERROR ===");
        Console.WriteLine($"Error: {ex.Message}");
        Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
        }
    }
}

// === MIDDLEWARE ===
app.UseCors("FrontendDev");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("\n=== APPLICATION STARTED ===");
Console.WriteLine($"JWT Key Length: {keyString.Length} characters");
Console.WriteLine($"API Running on: http://localhost:5217");
Console.WriteLine($"Login Endpoint: http://localhost:5217/api/auth/login");
Console.WriteLine($"Press Ctrl+C to stop");

app.Run();

// Yardımcı metod
static string GenerateSecureKey(int length)
{
    const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";
    var random = new Random();
    var chars = new char[length];
    
    for (int i = 0; i < length; i++)
    {
        chars[i] = validChars[random.Next(validChars.Length)];
    }
    
    return new string(chars);
}

// DateOnly için JSON converter sınıfları (Program.cs sonunda)
public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string Format = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (string.IsNullOrEmpty(value))
            return default;
            
        return DateOnly.Parse(value);
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