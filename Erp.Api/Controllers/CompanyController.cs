using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly ErpDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;

        public CompanyController(ErpDbContext context)
        {
            _context = context;
            
            // JSON serializer options - DateOnly desteği için
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters = { new DateOnlyJsonConverter() }
            };
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _context.Companies.ToListAsync();
            return Ok(companies);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            try
            {
                // Kontrol: Aynı companyId zaten var mı?
                var existingCompany = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == company.CompanyId);
                
                if (existingCompany != null)
                {
                    return Conflict(new { message = $"Company with ID {company.CompanyId} already exists." });
                }

                // Rowversion ve Rowkey otomatik set et
                company.Rowversion = 1;
                company.Rowkey = Guid.NewGuid().ToString();
                company.CreationDate = DateOnly.FromDateTime(DateTime.Now);

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetCompany), new { companyId = company.CompanyId }, company);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{companyId}")]
        public async Task<IActionResult> UpdateCompany(string companyId, [FromBody] CompanyUpdateDto updateDto)
        {
            try
            {
                Console.WriteLine($"UpdateCompany called for: {companyId}");
                Console.WriteLine($"Received DTO: {JsonSerializer.Serialize(updateDto)}");

                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == companyId);
                
                if (company == null)
                {
                    Console.WriteLine($"Company {companyId} not found");
                    return NotFound(new { message = $"Company with ID {companyId} not found." });
                }

                Console.WriteLine($"Current company rowversion: {company.Rowversion}");
                Console.WriteLine($"Incoming rowversion: {updateDto.Rowversion}");

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.Name))
                {
                    Console.WriteLine($"Updating Name: {company.Name} -> {updateDto.Name}");
                    company.Name = updateDto.Name;
                }
                
                if (updateDto.AssociationNo != null)
                {
                    Console.WriteLine($"Updating AssociationNo: {company.AssociationNo} -> {updateDto.AssociationNo}");
                    company.AssociationNo = updateDto.AssociationNo;
                }
                
                if (!string.IsNullOrEmpty(updateDto.DefaultLanguage))
                {
                    Console.WriteLine($"Updating DefaultLanguage: {company.DefaultLanguage} -> {updateDto.DefaultLanguage}");
                    company.DefaultLanguage = updateDto.DefaultLanguage;
                }
                
                if (updateDto.Logotype != null)
                {
                    Console.WriteLine($"Updating Logotype: {company.Logotype} -> {updateDto.Logotype}");
                    company.Logotype = updateDto.Logotype;
                }
                
                if (updateDto.CorporateForm != null)
                {
                    Console.WriteLine($"Updating CorporateForm: {company.CorporateForm} -> {updateDto.CorporateForm}");
                    company.CorporateForm = updateDto.CorporateForm;
                }
                
                if (!string.IsNullOrEmpty(updateDto.Country))
                {
                    Console.WriteLine($"Updating Country: {company.Country} -> {updateDto.Country}");
                    company.Country = updateDto.Country;
                }
                
                if (!string.IsNullOrEmpty(updateDto.LocalizationCountry))
                {
                    Console.WriteLine($"Updating LocalizationCountry: {company.LocalizationCountry} -> {updateDto.LocalizationCountry}");
                    company.LocalizationCountry = updateDto.LocalizationCountry;
                }

                // Rowversion'ı artır
                company.Rowversion++;
                Console.WriteLine($"New rowversion: {company.Rowversion}");

                // Sadece değişen alanları güncelle
                _context.Entry(company).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Company updated successfully: {companyId}");
                return Ok(company);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating company: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{companyId}")]
        public async Task<IActionResult> GetCompany(string companyId)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);
            
            if (company == null)
            {
                return NotFound(new { message = $"Company with ID {companyId} not found." });
            }
            
            return Ok(company);
        }

        [HttpDelete("{companyId}")]
        public async Task<IActionResult> DeleteCompany(string companyId)
        {
            try
            {
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == companyId);
                
                if (company == null)
                {
                    return NotFound(new { message = $"Company with ID {companyId} not found." });
                }

                _context.Companies.Remove(company);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = $"Company {companyId} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }

    // Güncelleme için DTO
    public class CompanyUpdateDto
    {
        public string? Name { get; set; }
        public string? AssociationNo { get; set; }
        public string? DefaultLanguage { get; set; }
        public string? Logotype { get; set; }
        public string? CorporateForm { get; set; }
        public string? Country { get; set; }
        public string? LocalizationCountry { get; set; }
        public decimal Rowversion { get; set; }
    }

    // DateOnly için JSON converter
    public class DateOnlyJsonConverter : JsonConverter<DateOnly>
    {
        private const string Format = "yyyy-MM-dd";

        public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateOnly.Parse(reader.GetString()!);
        }

        public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(Format));
        }
    }
}