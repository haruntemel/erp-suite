using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutingHeadTabController : ControllerBase  // TEKİL İSİM
    {
        private readonly ErpDbContext _context;

        public RoutingHeadTabController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
public async Task<IActionResult> GetAllRoutingHeadTabs()
{
    try
    {
        // SADECE ana tablodan veri çek, INCLUDE KULLANMA
        var heads = await _context.RoutingHeadTabs
            .OrderByDescending(h => h.CreateDate)
            .Take(1000)
            .ToListAsync();
            
        Console.WriteLine($"GetAllRoutingHeadTabs: {heads.Count} kayıt döndü");
        return Ok(heads);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"GetAllRoutingHeadTabs hatası: {ex.Message}");
        Console.WriteLine($"StackTrace: {ex.StackTrace}");
        return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
    }
}

        // GET: api/RoutingHeadTab/{company}/{contract}/{partNo}/{routingRevision}/{bomType}
        [HttpGet("{company}/{contract}/{partNo}/{routingRevision}/{bomType}")]
        public async Task<IActionResult> GetRoutingHeadTab(
            string company, string contract, string partNo, string routingRevision, string bomType)
        {
            try
            {
                // INCLUDE'u KALDIR
                var head = await _context.RoutingHeadTabs
                    .FirstOrDefaultAsync(h => h.Company == company &&
                                             h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.RoutingRevision == routingRevision &&
                                             h.BomType == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Routing head not found." });
                }
                
                return Ok(head);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // POST: api/RoutingHeadTab
        [HttpPost]
        public async Task<IActionResult> CreateRoutingHeadTab(
            [FromBody] RoutingHeadTabCreateDto createDto)
        {
            try
            {
                // Kontrol: Aynı kayıt zaten var mı?
                var existingHead = await _context.RoutingHeadTabs
                    .FirstOrDefaultAsync(h => h.Company == createDto.Company &&
                                             h.Contract == createDto.Contract &&
                                             h.PartNo == createDto.PartNo &&
                                             h.RoutingRevision == createDto.RoutingRevision &&
                                             h.BomType == createDto.BomType);
                
                if (existingHead != null)
                {
                    return Conflict(new { 
                        message = $"Routing head already exists for Company: {createDto.Company}, Contract: {createDto.Contract}, Part: {createDto.PartNo}, RoutingRevision: {createDto.RoutingRevision}, BomType: {createDto.BomType}" 
                    });
                }

                // Yeni kayıt oluştur
                var head = new RoutingHeadTab
                {
                    Company = createDto.Company,
                    Contract = createDto.Contract,
                    PartNo = createDto.PartNo,
                    RoutingRevision = createDto.RoutingRevision,
                    BomType = createDto.BomType,
                    NoteText = createDto.NoteText,
                    PhaseInDate = createDto.PhaseInDate.HasValue ? 
                        DateOnly.FromDateTime(createDto.PhaseInDate.Value) : (DateOnly?)null,
                    PhaseOutDate = createDto.PhaseOutDate.HasValue ? 
                        DateOnly.FromDateTime(createDto.PhaseOutDate.Value) : (DateOnly?)null,
                    CreateDate = DateOnly.FromDateTime(DateTime.Now),
                    Rowversion = DateOnly.FromDateTime(DateTime.Now),
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.RoutingHeadTabs.Add(head);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetRoutingHeadTab), 
                    new { 
                        company = head.Company,
                        contract = head.Contract,
                        partNo = head.PartNo,
                        routingRevision = head.RoutingRevision,
                        bomType = head.BomType
                    }, 
                    head);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating routing head: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // PUT: api/RoutingHeadTab/{company}/{contract}/{partNo}/{routingRevision}/{bomType}
        [HttpPut("{company}/{contract}/{partNo}/{routingRevision}/{bomType}")]
        public async Task<IActionResult> UpdateRoutingHeadTab(
            string company, string contract, string partNo, string routingRevision, string bomType,
            [FromBody] RoutingHeadTabUpdateDto updateDto)
        {
            try
            {
                var head = await _context.RoutingHeadTabs
                    .FirstOrDefaultAsync(h => h.Company == company &&
                                             h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.RoutingRevision == routingRevision &&
                                             h.BomType == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Routing head not found." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.NoteText))
                    head.NoteText = updateDto.NoteText;
                    
                if (updateDto.PhaseInDate.HasValue)
                    head.PhaseInDate = updateDto.PhaseInDate.Value;
                    
                if (updateDto.PhaseOutDate.HasValue)
                    head.PhaseOutDate = updateDto.PhaseOutDate.Value;

                await _context.SaveChangesAsync();
                
                return Ok(head);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating routing head: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DELETE: api/RoutingHeadTab/{company}/{contract}/{partNo}/{routingRevision}/{bomType}
        [HttpDelete("{company}/{contract}/{partNo}/{routingRevision}/{bomType}")]
        public async Task<IActionResult> DeleteRoutingHeadTab(
            string company, string contract, string partNo, string routingRevision, string bomType)
        {
            try
            {
                var head = await _context.RoutingHeadTabs
                    .FirstOrDefaultAsync(h => h.Company == company &&
                                             h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.RoutingRevision == routingRevision &&
                                             h.BomType == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Routing head not found." });
                }

                _context.RoutingHeadTabs.Remove(head);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Routing head deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfları
        public class RoutingHeadTabCreateDto
        {
            public required string Company { get; set; }
            public required string Contract { get; set; }
            public required string PartNo { get; set; }
            public required string RoutingRevision { get; set; }
            public required string BomType { get; set; }
            public string? NoteText { get; set; }
            public DateTime? PhaseInDate { get; set; }
            public DateTime? PhaseOutDate { get; set; }
        }

        public class RoutingHeadTabUpdateDto
        {
            public string? NoteText { get; set; }
            public DateOnly? PhaseInDate { get; set; }
            public DateOnly? PhaseOutDate { get; set; }
        }
    }
}