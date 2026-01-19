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
    public class InventoryPartController : ControllerBase
    {
        private readonly ErpDbContext _context;
        private readonly JsonSerializerOptions _jsonOptions;

        public InventoryPartController(ErpDbContext context)
        {
            _context = context;
            
            // JSON serializer options - DateOnly desteği için
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters = { new DateOnlyJsonConverter() }
            };
        }

        // GET: api/inventorypart
        [HttpGet]
        public async Task<IActionResult> GetInventoryParts()
        {
            var parts = await _context.InventoryParts.ToListAsync();
            return Ok(parts);
        }

        // GET: api/inventorypart/{contract}/{partNo}
        [HttpGet("{contract}/{partNo}")]
        public async Task<IActionResult> GetInventoryPart(string contract, string partNo)
        {
            var part = await _context.InventoryParts
                .FirstOrDefaultAsync(p => p.Contract == contract && p.PartNo == partNo);
            
            if (part == null)
            {
                return NotFound(new { message = $"InventoryPart with Contract={contract} and PartNo={partNo} not found." });
            }
            
            return Ok(part);
        }

        // POST: api/inventorypart
        [HttpPost]
        public async Task<IActionResult> CreateInventoryPart([FromBody] InventoryPart part)
        {
            try
            {
                // Kontrol: Aynı contract+partNo zaten var mı?
                var existingPart = await _context.InventoryParts
                    .FirstOrDefaultAsync(p => p.Contract == part.Contract && p.PartNo == part.PartNo);
                
                if (existingPart != null)
                {
                    return Conflict(new { 
                        message = $"InventoryPart with Contract={part.Contract} and PartNo={part.PartNo} already exists." 
                    });
                }

                // Rowversion ve Rowkey otomatik set et
                part.Rowversion = 1;
                part.Rowkey = Guid.NewGuid().ToString();
                part.CreateDate = DateOnly.FromDateTime(DateTime.Now);

                _context.InventoryParts.Add(part);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(
                    nameof(GetInventoryPart), 
                    new { contract = part.Contract, partNo = part.PartNo }, 
                    part
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // PUT: api/inventorypart/{contract}/{partNo}
        [HttpPut("{contract}/{partNo}")]
        public async Task<IActionResult> UpdateInventoryPart(
            string contract, 
            string partNo, 
            [FromBody] InventoryPartUpdateDto updateDto)
        {
            try
            {
                Console.WriteLine($"UpdateInventoryPart called for: Contract={contract}, PartNo={partNo}");
                Console.WriteLine($"Received DTO: {JsonSerializer.Serialize(updateDto)}");

                var part = await _context.InventoryParts
                    .FirstOrDefaultAsync(p => p.Contract == contract && p.PartNo == partNo);
                
                if (part == null)
                {
                    Console.WriteLine($"InventoryPart {contract}/{partNo} not found");
                    return NotFound(new { 
                        message = $"InventoryPart with Contract={contract} and PartNo={partNo} not found." 
                    });
                }

                Console.WriteLine($"Current part rowversion: {part.Rowversion}");
                Console.WriteLine($"Incoming rowversion: {updateDto.Rowversion}");

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.Description))
                {
                    Console.WriteLine($"Updating Description: {part.Description} -> {updateDto.Description}");
                    part.Description = updateDto.Description;
                }
                
                if (updateDto.ListPrice.HasValue)
                {
                    Console.WriteLine($"Updating ListPrice: {part.ListPrice} -> {updateDto.ListPrice}");
                    part.ListPrice = updateDto.ListPrice;
                }
                
                if (updateDto.ListPriceInclTax.HasValue)
                {
                    Console.WriteLine($"Updating ListPriceInclTax: {part.ListPriceInclTax} -> {updateDto.ListPriceInclTax}");
                    part.ListPriceInclTax = updateDto.ListPriceInclTax;
                }
                
                if (updateDto.PriceConvFactor.HasValue)
                {
                    Console.WriteLine($"Updating PriceConvFactor: {part.PriceConvFactor} -> {updateDto.PriceConvFactor}");
                    part.PriceConvFactor = updateDto.PriceConvFactor;
                }
                
                if (!string.IsNullOrEmpty(updateDto.TaxCode))
                {
                    Console.WriteLine($"Updating TaxCode: {part.TaxCode} -> {updateDto.TaxCode}");
                    part.TaxCode = updateDto.TaxCode;
                }
                
                if (!string.IsNullOrEmpty(updateDto.TaxClassId))
                {
                    Console.WriteLine($"Updating TaxClassId: {part.TaxClassId} -> {updateDto.TaxClassId}");
                    part.TaxClassId = updateDto.TaxClassId;
                }
                
                if (!string.IsNullOrEmpty(updateDto.SalesType))
                {
                    Console.WriteLine($"Updating SalesType: {part.SalesType} -> {updateDto.SalesType}");
                    part.SalesType = updateDto.SalesType;
                }
                
                if (!string.IsNullOrEmpty(updateDto.SalesTypeDb))
                {
                    Console.WriteLine($"Updating SalesTypeDb: {part.SalesTypeDb} -> {updateDto.SalesTypeDb}");
                    part.SalesTypeDb = updateDto.SalesTypeDb;
                }
                
                if (!string.IsNullOrEmpty(updateDto.UnitMeas))
                {
                    Console.WriteLine($"Updating UnitMeas: {part.UnitMeas} -> {updateDto.UnitMeas}");
                    part.UnitMeas = updateDto.UnitMeas;
                }
                
                if (!string.IsNullOrEmpty(updateDto.SalesUnitMeas))
                {
                    Console.WriteLine($"Updating SalesUnitMeas: {part.SalesUnitMeas} -> {updateDto.SalesUnitMeas}");
                    part.SalesUnitMeas = updateDto.SalesUnitMeas;
                }

                // Rowversion'ı artır
                part.Rowversion++;
                Console.WriteLine($"New rowversion: {part.Rowversion}");

                // Sadece değişen alanları güncelle
                _context.Entry(part).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"InventoryPart updated successfully: {contract}/{partNo}");
                return Ok(part);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating InventoryPart: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DELETE: api/inventorypart/{contract}/{partNo}
        [HttpDelete("{contract}/{partNo}")]
        public async Task<IActionResult> DeleteInventoryPart(string contract, string partNo)
        {
            try
            {
                var part = await _context.InventoryParts
                    .FirstOrDefaultAsync(p => p.Contract == contract && p.PartNo == partNo);
                
                if (part == null)
                {
                    return NotFound(new { 
                        message = $"InventoryPart with Contract={contract} and PartNo={partNo} not found." 
                    });
                }

                _context.InventoryParts.Remove(part);
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = $"InventoryPart {contract}/{partNo} deleted successfully." 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/inventorypart/search?contract=ABC&partNo=123
        [HttpGet("search")]
        public async Task<IActionResult> SearchInventoryParts(
            [FromQuery] string? contract,
            [FromQuery] string? partNo,
            [FromQuery] string? description)
        {
            var query = _context.InventoryParts.AsQueryable();

            if (!string.IsNullOrEmpty(contract))
            {
                query = query.Where(p => p.Contract.Contains(contract));
            }
            
            if (!string.IsNullOrEmpty(partNo))
            {
                query = query.Where(p => p.PartNo.Contains(partNo));
            }
            
            if (!string.IsNullOrEmpty(description))
            {
                query = query.Where(p => p.Description != null && p.Description.Contains(description));
            }

            var results = await query.ToListAsync();
            return Ok(results);
        }
    }

    // Güncelleme için DTO
    public class InventoryPartUpdateDto
    {
        public string? Description { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? ListPriceInclTax { get; set; }
        public decimal? PriceConvFactor { get; set; }
        public string? TaxCode { get; set; }
        public string? TaxClassId { get; set; }
        public string? SalesType { get; set; }
        public string? SalesTypeDb { get; set; }
        public string? UnitMeas { get; set; }
        public string? SalesUnitMeas { get; set; }
        public decimal Rowversion { get; set; }
    }

   
}