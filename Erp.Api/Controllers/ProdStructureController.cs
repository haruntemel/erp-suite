using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdStructureController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public ProdStructureController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllProdStructures()
        {
            try
            {
                var structures = await _context.ProdStructureTabs
                    .OrderByDescending(s => s.CreateDate)
                    .Take(1000)
                    .ToListAsync();
                    
                Console.WriteLine($"GetAllProdStructures: {structures.Count} satır döndü");
                return Ok(structures);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAllProdStructures hatası: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProdStructures(
            [FromQuery] string? search = null,
            [FromQuery] string? partNo = null,
            [FromQuery] string? componentPart = null,
            [FromQuery] string? contract = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.ProdStructureTabs.AsQueryable();
                
                // Arama filtresi
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(s => 
                        (s.PartNo != null && s.PartNo.Contains(search)) ||
                        (s.ComponentPart != null && s.ComponentPart.Contains(search)) ||
                        (s.NoteText != null && s.NoteText.Contains(search)));
                }
                
                // PartNo filtresi
                if (!string.IsNullOrEmpty(partNo))
                {
                    query = query.Where(s => s.PartNo != null && s.PartNo.Contains(partNo));
                }
                
                // ComponentPart filtresi
                if (!string.IsNullOrEmpty(componentPart))
                {
                    query = query.Where(s => s.ComponentPart != null && s.ComponentPart.Contains(componentPart));
                }
                
                // Contract filtresi
                if (!string.IsNullOrEmpty(contract))
                {
                    query = query.Where(s => s.Contract != null && s.Contract.Contains(contract));
                }
                
                // Toplam kayıt sayısı
                var totalCount = await query.CountAsync();
                
                // Sayfalama
                var items = await query
                    .OrderByDescending(s => s.CreateDate)
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

        [HttpGet("head/{contract}/{partNo}/{engChgLevel}/{bomType}/{alternativeNo}")]
        public async Task<IActionResult> GetProdStructuresByHead(
            string contract, string partNo, string engChgLevel, 
            string bomType, string alternativeNo)
        {
            try
            {
                var structures = await _context.ProdStructureTabs
                    .Where(s => s.Contract == contract && 
                               s.PartNo == partNo && 
                               s.EngChgLevel == engChgLevel &&
                               s.BomTypeDb == bomType &&
                               s.AlternativeNo == alternativeNo)
                    .OrderBy(s => s.LineItemNo)
                    .ThenBy(s => s.LineSequence)
                    .ThenBy(s => s.OperationNo)
                    .ToListAsync();
                    
                if (structures == null || structures.Count == 0)
                {
                    return Ok(new List<ProdStructureTab>()); // Boş liste dön
                }
                    
                return Ok(structures);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{contract}/{partNo}/{engChgLevel}/{bomType}/{alternativeNo}/{lineItemNo}/{lineSequence}/{operationNo}")]
        public async Task<IActionResult> GetProdStructure(
            string contract, string partNo, string engChgLevel, 
            string bomType, string alternativeNo,
            decimal lineItemNo, decimal lineSequence, decimal operationNo)
        {
            try
            {
                var structure = await _context.ProdStructureTabs
                    .FirstOrDefaultAsync(s => s.Contract == contract &&
                                             s.PartNo == partNo &&
                                             s.EngChgLevel == engChgLevel &&
                                             s.BomTypeDb == bomType &&
                                             s.AlternativeNo == alternativeNo &&
                                             s.LineItemNo == lineItemNo &&
                                             s.LineSequence == lineSequence &&
                                             s.OperationNo == operationNo);
                
                if (structure == null)
                {
                    return NotFound(new { message = "Product structure not found." });
                }
                
                return Ok(structure);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("head/{contract}/{partNo}/{engChgLevel}/{bomType}/{alternativeNo}")]
        public async Task<IActionResult> AddProdStructure(
            string contract, string partNo, string engChgLevel, 
            string bomType, string alternativeNo,
            [FromBody] ProdStructureCreateDto createDto)
        {
            try
            {
                // Head'in var olduğunu kontrol et
                var head = await _context.ProdStructureHeadTabs
                    .FirstOrDefaultAsync(h => h.Contract == contract &&
                                             h.PartNo == partNo &&
                                             h.EngChgLevel == engChgLevel &&
                                             h.BomTypeDb == bomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Product structure head not found." });
                }

                // Aynı satır kontrolü
                var existingStructure = await _context.ProdStructureTabs
                    .FirstOrDefaultAsync(s => s.Contract == contract &&
                                             s.PartNo == partNo &&
                                             s.EngChgLevel == engChgLevel &&
                                             s.BomTypeDb == bomType &&
                                             s.AlternativeNo == alternativeNo &&
                                             s.LineItemNo == createDto.LineItemNo &&
                                             s.LineSequence == createDto.LineSequence &&
                                             s.OperationNo == createDto.OperationNo);
                
                if (existingStructure != null)
                {
                    return Conflict(new { message = "Product structure line already exists." });
                }

                // Yeni satır oluştur
                var structure = new ProdStructureTab
                {
                    Contract = contract,
                    PartNo = partNo,
                    EngChgLevel = engChgLevel,
                    BomTypeDb = bomType,
                    AlternativeNo = alternativeNo,
                    LineItemNo = createDto.LineItemNo,
                    LineSequence = createDto.LineSequence,
                    OperationNo = createDto.OperationNo,
                    NoteText = createDto.NoteText,
                    Source = createDto.Source,
                    CreateDate = DateTime.Now,
                    LastActivityDate = createDto.LastActivityDate,
                    ComponentPart = createDto.ComponentPart,
                    Rowstate = createDto.Rowstate ?? "Active",
                    CreatedBy = User.Identity?.Name ?? "System",
                    Rowversion = 1,
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.ProdStructureTabs.Add(structure);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetProdStructure), 
                    new { 
                        contract = structure.Contract,
                        partNo = structure.PartNo,
                        engChgLevel = structure.EngChgLevel,
                        bomType = structure.BomTypeDb,
                        alternativeNo = structure.AlternativeNo,
                        lineItemNo = structure.LineItemNo,
                        lineSequence = structure.LineSequence,
                        operationNo = structure.OperationNo
                    }, 
                    structure);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{contract}/{partNo}/{engChgLevel}/{bomType}/{alternativeNo}/{lineItemNo}/{lineSequence}/{operationNo}")]
public async Task<IActionResult> UpdateProdStructure(
    string contract, string partNo, string engChgLevel, 
    string bomType, string alternativeNo,
    decimal lineItemNo, decimal lineSequence, decimal operationNo,
    [FromBody] ProdStructureUpdateDto updateDto)
{
    try
    {
        Console.WriteLine($"=== UPDATE PROD STRUCTURE ===");
        Console.WriteLine($"Aranan kayıt: Contract={contract}, PartNo={partNo}, EngChgLevel={engChgLevel}");
        Console.WriteLine($"BomType={bomType}, AlternativeNo={alternativeNo}");
        Console.WriteLine($"LineItemNo={lineItemNo}, LineSequence={lineSequence}, OperationNo={operationNo}");
        
        var structure = await _context.ProdStructureTabs
            .FirstOrDefaultAsync(s => s.Contract == contract &&
                                     s.PartNo == partNo &&
                                     s.EngChgLevel == engChgLevel &&
                                     s.BomTypeDb == bomType &&
                                     s.AlternativeNo == alternativeNo &&
                                     s.LineItemNo == lineItemNo &&
                                     s.LineSequence == lineSequence &&
                                     s.OperationNo == operationNo);
        
        if (structure == null)
        {
            Console.WriteLine($"=== KAYIT BULUNAMADI ===");
            // Tüm kayıtları listeleyelim
            var allStructures = await _context.ProdStructureTabs.ToListAsync();
            Console.WriteLine($"Toplam kayıt sayısı: {allStructures.Count}");
            foreach (var item in allStructures)
            {
                Console.WriteLine($"- {item.Contract}|{item.PartNo}|{item.EngChgLevel}|{item.BomTypeDb}|{item.AlternativeNo}|{item.LineItemNo}|{item.LineSequence}|{item.OperationNo}");
            }
            
            return NotFound(new { message = "Product structure not found." });
        }

        Console.WriteLine($"=== KAYIT BULUNDU ===");
        Console.WriteLine($"Mevcut Rowversion: {structure.Rowversion}, Gelen Rowversion: {updateDto.Rowversion}");
        
        // Rowversion kontrolü
        if (structure.Rowversion != updateDto.Rowversion)
        {
            return Conflict(new { message = "Record has been modified by another user." });
        }

        // Güncelleme işlemleri
        Console.WriteLine($"=== GÜNCELLEME İŞLEMLERİ ===");
        
        if (!string.IsNullOrEmpty(updateDto.NoteText))
        {
            structure.NoteText = updateDto.NoteText;
            Console.WriteLine($"NoteText güncellendi: {updateDto.NoteText}");
        }
            
        if (!string.IsNullOrEmpty(updateDto.Source))
        {
            structure.Source = updateDto.Source;
            Console.WriteLine($"Source güncellendi: {updateDto.Source}");
        }
            
        if (updateDto.LastActivityDate.HasValue)
        {
            structure.LastActivityDate = updateDto.LastActivityDate.Value;
            Console.WriteLine($"LastActivityDate güncellendi: {updateDto.LastActivityDate.Value}");
        }
            
        if (!string.IsNullOrEmpty(updateDto.ComponentPart))
        {
            structure.ComponentPart = updateDto.ComponentPart;
            Console.WriteLine($"ComponentPart güncellendi: {updateDto.ComponentPart}");
        }
            
        if (!string.IsNullOrEmpty(updateDto.Rowstate))
        {
            structure.Rowstate = updateDto.Rowstate;
            Console.WriteLine($"Rowstate güncellendi: {updateDto.Rowstate}");
        }

        // Rowversion'ı artır
        structure.Rowversion++;
        Console.WriteLine($"Yeni Rowversion: {structure.Rowversion}");

        await _context.SaveChangesAsync();
        Console.WriteLine($"=== KAYIT BAŞARIYLA GÜNCELLENDİ ===");
        
        return Ok(structure);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"=== HATA ===");
        Console.WriteLine($"Message: {ex.Message}");
        Console.WriteLine($"StackTrace: {ex.StackTrace}");
        return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
    }
}

        [HttpDelete("{contract}/{partNo}/{engChgLevel}/{bomType}/{alternativeNo}/{lineItemNo}/{lineSequence}/{operationNo}")]
        public async Task<IActionResult> DeleteProdStructure(
            string contract, string partNo, string engChgLevel, 
            string bomType, string alternativeNo,
            decimal lineItemNo, decimal lineSequence, decimal operationNo)
        {
            try
            {
                var structure = await _context.ProdStructureTabs
                    .FirstOrDefaultAsync(s => s.Contract == contract &&
                                             s.PartNo == partNo &&
                                             s.EngChgLevel == engChgLevel &&
                                             s.BomTypeDb == bomType &&
                                             s.AlternativeNo == alternativeNo &&
                                             s.LineItemNo == lineItemNo &&
                                             s.LineSequence == lineSequence &&
                                             s.OperationNo == operationNo);
                
                if (structure == null)
                {
                    return NotFound(new { message = "Product structure not found." });
                }

                _context.ProdStructureTabs.Remove(structure);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Product structure line deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfları
        public class ProdStructureCreateDto
        {
            public required decimal LineItemNo { get; set; }
            public required decimal LineSequence { get; set; }
            public required decimal OperationNo { get; set; }
            public string? NoteText { get; set; }
            public string? Source { get; set; }
            public DateTime? LastActivityDate { get; set; }
            public string? ComponentPart { get; set; }
            public string? Rowstate { get; set; }
        }

        public class ProdStructureUpdateDto
        {
            public string? NoteText { get; set; }
            public string? Source { get; set; }
            public DateTime? LastActivityDate { get; set; }
            public string? ComponentPart { get; set; }
            public string? Rowstate { get; set; }
            public decimal Rowversion { get; set; }
        }
    }
}