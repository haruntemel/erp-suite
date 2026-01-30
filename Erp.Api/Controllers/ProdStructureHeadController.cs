using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdStructureHeadController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public ProdStructureHeadController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProdStructureHeads()
        {
            try
            {
                var heads = await _context.ProdStructureHeadTabs
                    .OrderByDescending(h => h.CreateDate)
                    .Take(1000)
                    .ToListAsync();
                    
                Console.WriteLine($"GetAllProdStructureHeads: {heads.Count} kayıt döndü");
                return Ok(heads);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAllProdStructureHeads hatası: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProdStructureHeads(
            [FromQuery] string? search = null,
            [FromQuery] string? partNo = null,
            [FromQuery] string? bomType = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.ProdStructureHeadTabs.AsQueryable();
                
                // Arama filtresi
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h => 
                        (h.PartNo != null && h.PartNo.Contains(search)) ||
                        (h.NoteText != null && h.NoteText.Contains(search)) ||
                        (h.EngChgLevel != null && h.EngChgLevel.Contains(search)));
                }
                
                // PartNo filtresi
                if (!string.IsNullOrEmpty(partNo))
                {
                    query = query.Where(h => h.PartNo != null && h.PartNo.Contains(partNo));
                }
                
                // BomType filtresi
                if (!string.IsNullOrEmpty(bomType))
                {
                    query = query.Where(h => h.BomTypeDb != null && h.BomTypeDb.Contains(bomType));
                }
                
                // Toplam kayıt sayısı
                var totalCount = await query.CountAsync();
                
                // Sayfalama
                var items = await query
                    .OrderByDescending(h => h.CreateDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                
                // Yanıt
                var result = new
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    Items = items
                };
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{contract}/{partNo}/{engChgLevel}/{bomType}")]
        public async Task<IActionResult> GetProdStructureHead(
            string contract, string partNo, string engChgLevel, string bomType)
        {
            try
            {
                var head = await _context.ProdStructureHeadTabs
                    .FirstOrDefaultAsync(h => h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.EngChgLevel == engChgLevel &&
                                             h.BomTypeDb == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Product structure head not found." });
                }
                
                return Ok(head);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProdStructureHead(
            [FromBody] ProdStructureHeadCreateDto createDto)
        {
            try
            {
                // Kontrol: Aynı kayıt zaten var mı?
                var existingHead = await _context.ProdStructureHeadTabs
                    .FirstOrDefaultAsync(h => h.Contract == createDto.Contract &&
                                             h.PartNo == createDto.PartNo &&
                                             h.EngChgLevel == createDto.EngChgLevel &&
                                             h.BomTypeDb == createDto.BomTypeDb);
                
                if (existingHead != null)
                {
                    return Conflict(new { 
                        message = $"Product structure head already exists for Contract: {createDto.Contract}, Part: {createDto.PartNo}, EngChgLevel: {createDto.EngChgLevel}, BomType: {createDto.BomTypeDb}" 
                    });
                }

                // Yeni kayıt oluştur
                var head = new ProdStructureHeadTab
                {
                    Contract = createDto.Contract,
                    PartNo = createDto.PartNo,
                    EngChgLevel = createDto.EngChgLevel,
                    BomTypeDb = createDto.BomTypeDb,
                    NoteText = createDto.NoteText,
                    EffPhaseInDate = createDto.EffPhaseInDate,
                    EffPhaseOutDate = createDto.EffPhaseOutDate,
                    CreateDate = DateTime.Now,
                    Rowstate = createDto.Rowstate ?? "Active",
                    CreatedBy = User.Identity?.Name ?? "System",
                    Rowversion = 1,
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.ProdStructureHeadTabs.Add(head);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetProdStructureHead), 
                    new { 
                        contract = head.Contract, 
                        partNo = head.PartNo, 
                        engChgLevel = head.EngChgLevel,
                        bomType = head.BomTypeDb 
                    }, 
                    head);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{contract}/{partNo}/{engChgLevel}/{bomType}")]
        public async Task<IActionResult> UpdateProdStructureHead(
            string contract, string partNo, string engChgLevel, string bomType,
            [FromBody] ProdStructureHeadUpdateDto updateDto)
        {
            try
            {
                var head = await _context.ProdStructureHeadTabs
                    .FirstOrDefaultAsync(h => h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.EngChgLevel == engChgLevel &&
                                             h.BomTypeDb == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Product structure head not found." });
                }

                // Rowversion kontrolü
                if (head.Rowversion != updateDto.Rowversion)
                {
                    return Conflict(new { message = "Record has been modified by another user." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.NoteText))
                    head.NoteText = updateDto.NoteText;
                    
                if (updateDto.EffPhaseInDate.HasValue)
                    head.EffPhaseInDate = updateDto.EffPhaseInDate.Value;
                    
                if (updateDto.EffPhaseOutDate.HasValue)
                    head.EffPhaseOutDate = updateDto.EffPhaseOutDate.Value;
                    
                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                    head.Rowstate = updateDto.Rowstate;

                // Rowversion'ı artır
                head.Rowversion++;

                await _context.SaveChangesAsync();
                
                return Ok(head);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product structure head: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{contract}/{partNo}/{engChgLevel}/{bomType}")]
        public async Task<IActionResult> DeleteProdStructureHead(
            string contract, string partNo, string engChgLevel, string bomType)
        {
            try
            {
                var head = await _context.ProdStructureHeadTabs
                    .FirstOrDefaultAsync(h => h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.EngChgLevel == engChgLevel &&
                                             h.BomTypeDb == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Product structure head not found." });
                }

                _context.ProdStructureHeadTabs.Remove(head);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Product structure head deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfları
        public class ProdStructureHeadCreateDto
        {
            public required string Contract { get; set; }
            public required string PartNo { get; set; }
            public required string EngChgLevel { get; set; }
            public required string BomTypeDb { get; set; }
            public string? NoteText { get; set; }
            public DateTime? EffPhaseInDate { get; set; }
            public DateTime? EffPhaseOutDate { get; set; }
            public string? Rowstate { get; set; }
        }

        public class ProdStructureHeadUpdateDto
        {
            public string? NoteText { get; set; }
            public DateTime? EffPhaseInDate { get; set; }
            public DateTime? EffPhaseOutDate { get; set; }
            public string? Rowstate { get; set; }
            public decimal Rowversion { get; set; }
        }
    }
}