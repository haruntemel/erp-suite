using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔒 SADECE LOGIN OLANLAR
    public class InvoicesController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public InvoicesController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            try
            {
                Console.WriteLine($"🔐 Invoices API called by user");
                
                // Test verisi - gerçek uygulamada database'den çekersiniz
                var invoices = new[]
                {
                    new { 
                        Id = 1, 
                        InvoiceNo = "FTR-2024-001", 
                        Date = "2024-01-15", 
                        Customer = "ABC Şirketi",
                        Amount = 1500.00m, 
                        Tax = 270.00m,
                        Total = 1770.00m,
                        Status = "Ödendi",
                        DueDate = "2024-01-30"
                    },
                    new { 
                        Id = 2, 
                        InvoiceNo = "FTR-2024-002", 
                        Date = "2024-01-20", 
                        Customer = "XYZ Ltd.",
                        Amount = 2500.00m, 
                        Tax = 450.00m,
                        Total = 2950.00m,
                        Status = "Bekliyor",
                        DueDate = "2024-02-20"
                    },
                    new { 
                        Id = 3, 
                        InvoiceNo = "FTR-2024-003", 
                        Date = "2024-02-01", 
                        Customer = "123 Teknoloji",
                        Amount = 1800.00m, 
                        Tax = 324.00m,
                        Total = 2124.00m,
                        Status = "Ödendi",
                        DueDate = "2024-02-15"
                    },
                };

                return Ok(invoices);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Invoices error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult CreateInvoice([FromBody] CreateInvoiceDto dto)
        {
            try
            {
                Console.WriteLine($"📝 Creating invoice: {dto.InvoiceNo}");
                
                // Burada database'e kaydedersiniz
                return Ok(new { 
                    message = "Fatura oluşturuldu",
                    invoiceNo = dto.InvoiceNo,
                    id = new Random().Next(100, 999)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("test")]
        [AllowAnonymous] // Test için herkes erişebilir
        public IActionResult Test()
        {
            return Ok(new { 
                message = "Invoices API is working!",
                timestamp = DateTime.Now
            });
        }
    }

    public class CreateInvoiceDto
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public string Customer { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}