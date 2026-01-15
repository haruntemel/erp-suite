using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using System.Text.Json;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public CustomerController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(customers);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerInfo customer)
        {
            try
            {
                // Kontrol: Aynı customerId zaten var mı?
                var existingCustomer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.CustomerId == customer.CustomerId);
                
                if (existingCustomer != null)
                {
                    return Conflict(new { message = $"Customer with ID {customer.CustomerId} already exists." });
                }

                // Rowversion ve Rowkey otomatik set et
               
                customer.Rowversion = 1;
                customer.Rowkey = Guid.NewGuid().ToString();
                customer.CreationDate = DateOnly.FromDateTime(DateTime.Now);
                customer.CreatedBy = User.Identity?.Name ?? "System";

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetCustomer), new { customerId = customer.CustomerId }, customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{customerId}")]
        public async Task<IActionResult> UpdateCustomer(string customerId, [FromBody] CustomerUpdateDto updateDto)
        {
            try
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.CustomerId == customerId);
                
                if (customer == null)
                {
                    return NotFound(new { message = $"Customer with ID {customerId} not found." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.Name))
                {
                    customer.Name = updateDto.Name;
                }
                
                if (updateDto.AssociationNo != null)
                {
                    customer.AssociationNo = updateDto.AssociationNo;
                }
                
                if (!string.IsNullOrEmpty(updateDto.DefaultLanguage))
                {
                    customer.DefaultLanguage = updateDto.DefaultLanguage;
                }
                
                if (updateDto.CorporateForm != null)
                {
                    customer.CorporateForm = updateDto.CorporateForm;
                }
                
                if (!string.IsNullOrEmpty(updateDto.Country))
                {
                    customer.Country = updateDto.Country;
                }
                
                if (updateDto.PartyType != null)
                {
                    customer.PartyType = updateDto.PartyType;
                }
                
                if (updateDto.Category != null)
                {
                    customer.Category = updateDto.Category;
                }
                
                if (updateDto.CheckLimit != null)
                {
                    customer.CheckLimit = updateDto.CheckLimit;
                }
                
                if (updateDto.LimitControlType != null)
                {
                    customer.LimitControlType = updateDto.LimitControlType;
                }
                
                if (updateDto.IdentifierReference != null)
                {
                    customer.IdentifierReference = updateDto.IdentifierReference;
                }

                // ChangedBy güncelle
                customer.ChangedBy = User.Identity?.Name ?? "System";

               
// Rowversion'ı artır
                customer.Rowversion++;
                Console.WriteLine($"New rowversion: {customer.Rowversion}");
                // Sadece değişen alanları güncelle
                _context.Entry(customer).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                
                return Ok(customer);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating customer: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCustomer(string customerId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);
            
            if (customer == null)
            {
                return NotFound(new { message = $"Customer with ID {customerId} not found." });
            }
            
            return Ok(customer);
        }

        [HttpDelete("{customerId}")]
        public async Task<IActionResult> DeleteCustomer(string customerId)
        {
            try
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.CustomerId == customerId);
                
                if (customer == null)
                {
                    return NotFound(new { message = $"Customer with ID {customerId} not found." });
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = $"Customer {customerId} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }

    // Güncelleme için DTO - rowversion'ı DateOnly yap
    public class CustomerUpdateDto
    {
        public string? Name { get; set; }
        public string? AssociationNo { get; set; }
        public string? CorporateForm { get; set; }
        public string? Country { get; set; }
        public string? PartyType { get; set; }
        public string? Category { get; set; }
        public string? CheckLimit { get; set; }
        public string? LimitControlType { get; set; }
        public string? DefaultLanguage { get; set; }
        public string? IdentifierReference { get; set; }
        public decimal Rowversion { get; set; }
    }
}