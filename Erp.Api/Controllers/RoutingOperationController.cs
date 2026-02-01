using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutingOperationTabController : ControllerBase  // TEKİL İSİM
    {
        private readonly ErpDbContext _context;

        public RoutingOperationTabController(ErpDbContext context)
        {
            _context = context;
        }

        // GET: api/RoutingOperationTab/get-all
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllRoutingOperationTabs()
        {
            try
            {
                var operations = await _context.RoutingOperationTabs
                    .OrderBy(o => o.OperationNo)
                    .Take(1000)
                    .ToListAsync();
                    
                Console.WriteLine($"GetAllRoutingOperationTabs: {operations.Count} satır döndü");
                return Ok(operations);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetAllRoutingOperationTabs hatası: {ex.Message}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/RoutingOperationTab/ByHead/{company}/{contract}/{partNo}/{routingRevision}/{bomType}
        [HttpGet("ByHead/{company}/{contract}/{partNo}/{routingRevision}/{bomType}")]
        public async Task<IActionResult> GetRoutingOperationTabsByHead(
            string company, string contract, string partNo, string routingRevision, string bomType)
        {
            try
            {
                var operations = await _context.RoutingOperationTabs
                    .Where(o => o.Company == company && 
                               o.Contract == contract && 
                               o.PartNo == partNo &&
                               o.RoutingRevision == routingRevision &&
                               o.BomType == bomType)
                    .OrderBy(o => o.OperationNo)
                    .ToListAsync();
                    
                if (operations == null || operations.Count == 0)
                {
                    return Ok(new List<RoutingOperationTab>()); // Boş liste dön
                }
                    
                return Ok(operations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/RoutingOperationTab/{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}
        [HttpGet("{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}")]
        public async Task<IActionResult> GetRoutingOperationTab(
            string company, string contract, string partNo, string bomType, 
            string routingRevision, decimal operationNo)
        {
            try
            {
                var operation = await _context.RoutingOperationTabs
                    .FirstOrDefaultAsync(o => o.Company == company &&
                                             o.Contract == contract &&
                                             o.PartNo == partNo &&
                                             o.BomType == bomType &&
                                             o.RoutingRevision == routingRevision &&
                                             o.OperationNo == operationNo);
                
                if (operation == null)
                {
                    return NotFound(new { message = "Routing operation not found." });
                }
                
                return Ok(operation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // POST: api/RoutingOperationTab
        [HttpPost]
        public async Task<IActionResult> AddRoutingOperationTab(
            [FromBody] RoutingOperationTabCreateDto createDto)
        {
            try
            {
                // Head'in var olduğunu kontrol et
                var head = await _context.RoutingHeadTabs
                    .FirstOrDefaultAsync(h => h.Company == createDto.Company &&
                                             h.Contract == createDto.Contract &&
                                             h.PartNo == createDto.PartNo &&
                                             h.RoutingRevision == createDto.RoutingRevision &&
                                             h.BomType == createDto.BomType);
                
                if (head == null)
                {
                    return NotFound(new { message = "Routing head not found." });
                }

                // Aynı operasyon kontrolü
                var existingOperation = await _context.RoutingOperationTabs
                    .FirstOrDefaultAsync(o => o.Company == createDto.Company &&
                                             o.Contract == createDto.Contract &&
                                             o.PartNo == createDto.PartNo &&
                                             o.BomType == createDto.BomType &&
                                             o.RoutingRevision == createDto.RoutingRevision &&
                                             o.OperationNo == createDto.OperationNo);
                
                if (existingOperation != null)
                {
                    return Conflict(new { message = "Routing operation already exists." });
                }

                // Yeni operasyon oluştur
                var operation = new RoutingOperationTab
                {
                    Company = createDto.Company,
                    Contract = createDto.Contract,
                    PartNo = createDto.PartNo,
                    RoutingRevision = createDto.RoutingRevision,
                    BomType = createDto.BomType,
                    OperationNo = createDto.OperationNo,
                    OperationDescription = createDto.OperationDescription,
                    WorkCenterNo = createDto.WorkCenterNo,
                    MachRunFactor = createDto.MachRunFactor,
                    MachSetupTime = createDto.MachSetupTime,
                    LaborClassNo = createDto.LaborClassNo,
                    SetupLaborClassNo = createDto.SetupLaborClassNo,
                    CrewSize = createDto.CrewSize,
                    SetupCrewSize = createDto.SetupCrewSize,
                    RunTimeCode = createDto.RunTimeCode,
                    NoteText = createDto.NoteText,
                    Rowversion = DateOnly.FromDateTime(DateTime.Now),
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.RoutingOperationTabs.Add(operation);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetRoutingOperationTab), 
                    new { 
                        company = operation.Company,
                        contract = operation.Contract,
                        partNo = operation.PartNo,
                        bomType = operation.BomType,
                        routingRevision = operation.RoutingRevision,
                        operationNo = operation.OperationNo
                    }, 
                    operation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // PUT: api/RoutingOperationTab/{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}
        [HttpPut("{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}")]
        public async Task<IActionResult> UpdateRoutingOperationTab(
            string company, string contract, string partNo, string bomType, 
            string routingRevision, decimal operationNo,
            [FromBody] RoutingOperationTabUpdateDto updateDto)
        {
            try
            {
                var operation = await _context.RoutingOperationTabs
                    .FirstOrDefaultAsync(o => o.Company == company &&
                                             o.Contract == contract &&
                                             o.PartNo == partNo &&
                                             o.BomType == bomType &&
                                             o.RoutingRevision == routingRevision &&
                                             o.OperationNo == operationNo);
                
                if (operation == null)
                {
                    return NotFound(new { message = "Routing operation not found." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.OperationDescription))
                    operation.OperationDescription = updateDto.OperationDescription;
                    
                if (!string.IsNullOrEmpty(updateDto.WorkCenterNo))
                    operation.WorkCenterNo = updateDto.WorkCenterNo;
                    
                if (updateDto.MachRunFactor.HasValue)
                    operation.MachRunFactor = updateDto.MachRunFactor;
                    
                if (updateDto.MachSetupTime.HasValue)
                    operation.MachSetupTime = updateDto.MachSetupTime;
                    
                if (!string.IsNullOrEmpty(updateDto.LaborClassNo))
                    operation.LaborClassNo = updateDto.LaborClassNo;
                    
                if (!string.IsNullOrEmpty(updateDto.SetupLaborClassNo))
                    operation.SetupLaborClassNo = updateDto.SetupLaborClassNo;
                    
                if (updateDto.CrewSize.HasValue)
                    operation.CrewSize = updateDto.CrewSize;
                    
                if (updateDto.SetupCrewSize.HasValue)
                    operation.SetupCrewSize = updateDto.SetupCrewSize;
                    
                if (!string.IsNullOrEmpty(updateDto.RunTimeCode))
                    operation.RunTimeCode = updateDto.RunTimeCode;
                    
                if (!string.IsNullOrEmpty(updateDto.NoteText))
                    operation.NoteText = updateDto.NoteText;

                await _context.SaveChangesAsync();
                
                return Ok(operation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DELETE: api/RoutingOperationTab/{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}
        [HttpDelete("{company}/{contract}/{partNo}/{bomType}/{routingRevision}/{operationNo}")]
        public async Task<IActionResult> DeleteRoutingOperationTab(
            string company, string contract, string partNo, string bomType, 
            string routingRevision, decimal operationNo)
        {
            try
            {
                var operation = await _context.RoutingOperationTabs
                    .FirstOrDefaultAsync(o => o.Company == company &&
                                             o.Contract == contract &&
                                             o.PartNo == partNo &&
                                             o.BomType == bomType &&
                                             o.RoutingRevision == routingRevision &&
                                             o.OperationNo == operationNo);
                
                if (operation == null)
                {
                    return NotFound(new { message = "Routing operation not found." });
                }

                _context.RoutingOperationTabs.Remove(operation);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Routing operation deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfları
        public class RoutingOperationTabCreateDto
        {
            public required string Company { get; set; }
            public required string Contract { get; set; }
            public required string PartNo { get; set; }
            public required string RoutingRevision { get; set; }
            public required string BomType { get; set; }
            public required decimal OperationNo { get; set; }
            public string? OperationDescription { get; set; }
            public string? WorkCenterNo { get; set; }
            public decimal? MachRunFactor { get; set; }
            public decimal? MachSetupTime { get; set; }
            public string? LaborClassNo { get; set; }
            public string? SetupLaborClassNo { get; set; }
            public decimal? CrewSize { get; set; }
            public decimal? SetupCrewSize { get; set; }
            public string? RunTimeCode { get; set; }
            public string? NoteText { get; set; }
        }

        public class RoutingOperationTabUpdateDto
        {
            public string? OperationDescription { get; set; }
            public string? WorkCenterNo { get; set; }
            public decimal? MachRunFactor { get; set; }
            public decimal? MachSetupTime { get; set; }
            public string? LaborClassNo { get; set; }
            public string? SetupLaborClassNo { get; set; }
            public decimal? CrewSize { get; set; }
            public decimal? SetupCrewSize { get; set; }
            public string? RunTimeCode { get; set; }
            public string? NoteText { get; set; }
        }
    }
}