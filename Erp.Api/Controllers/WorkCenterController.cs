using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using System.Text.Json;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkCenterController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public WorkCenterController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkCenters()
        {
            var workCenters = await _context.WorkCenters.ToListAsync();
            return Ok(workCenters);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkCenter([FromBody] WorkCenterCreateDto createDto)
        {
            try
            {
                // Kontrol: Aynı composite key zaten var mı?
                var existingWorkCenter = await _context.WorkCenters
                    .FirstOrDefaultAsync(w => 
                        w.Company == createDto.Company && 
                        w.Contract == createDto.Contract && 
                        w.WorkCenterNo == createDto.WorkCenterNo);
                
                if (existingWorkCenter != null)
                {
                    return Conflict(new { 
                        message = $"WorkCenter with Company={createDto.Company}, " +
                                 $"Contract={createDto.Contract}, " +
                                 $"WorkCenterNo={createDto.WorkCenterNo} already exists." 
                    });
                }

                // DTO'dan WorkCenter nesnesi oluştur
                var workCenter = new WorkCenter
                {
                    Company = createDto.Company,
                    Contract = createDto.Contract,
                    WorkCenterNo = createDto.WorkCenterNo,
                    Description = createDto.Description,
                    WorkCenterCode = createDto.WorkCenterCode,
                    ProductionLine = createDto.ProductionLine,
                    DepartmentNo = createDto.DepartmentNo,
                    NoteText = createDto.NoteText,
                    Rowstate = createDto.Rowstate ?? "Active",
                    
                    // Otomatik alanları set et
                    CreateDate = DateOnly.FromDateTime(DateTime.Now),
                    Rowversion = DateOnly.FromDateTime(DateTime.Now),
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.WorkCenters.Add(workCenter);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(
                    nameof(GetWorkCenter), 
                    new { 
                        company = workCenter.Company, 
                        contract = workCenter.Contract, 
                        workCenterNo = workCenter.WorkCenterNo 
                    }, 
                    workCenter
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{company}/{contract}/{workCenterNo}")]
        public async Task<IActionResult> UpdateWorkCenter(
            string company, 
            string contract, 
            string workCenterNo, 
            [FromBody] WorkCenterUpdateDto updateDto)
        {
            try
            {
                var workCenter = await _context.WorkCenters
                    .FirstOrDefaultAsync(w => 
                        w.Company == company && 
                        w.Contract == contract && 
                        w.WorkCenterNo == workCenterNo);
                
                if (workCenter == null)
                {
                    return NotFound(new { 
                        message = $"WorkCenter with Company={company}, " +
                                 $"Contract={contract}, " +
                                 $"WorkCenterNo={workCenterNo} not found." 
                    });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.Description))
                {
                    workCenter.Description = updateDto.Description;
                }
                
                if (!string.IsNullOrEmpty(updateDto.WorkCenterCode))
                {
                    workCenter.WorkCenterCode = updateDto.WorkCenterCode;
                }
                
                if (!string.IsNullOrEmpty(updateDto.ProductionLine))
                {
                    workCenter.ProductionLine = updateDto.ProductionLine;
                }
                
                if (!string.IsNullOrEmpty(updateDto.DepartmentNo))
                {
                    workCenter.DepartmentNo = updateDto.DepartmentNo;
                }
                
                if (!string.IsNullOrEmpty(updateDto.NoteText))
                {
                    workCenter.NoteText = updateDto.NoteText;
                }
                
                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                {
                    workCenter.Rowstate = updateDto.Rowstate;
                }

                // Rowversion'ı güncelle (tarih olarak)
                workCenter.Rowversion = DateOnly.FromDateTime(DateTime.Now);

                // Sadece değişen alanları güncelle
                _context.Entry(workCenter).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                
                return Ok(workCenter);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating work center: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("{company}/{contract}/{workCenterNo}")]
        public async Task<IActionResult> GetWorkCenter(string company, string contract, string workCenterNo)
        {
            var workCenter = await _context.WorkCenters
                .FirstOrDefaultAsync(w => 
                    w.Company == company && 
                    w.Contract == contract && 
                    w.WorkCenterNo == workCenterNo);
            
            if (workCenter == null)
            {
                return NotFound(new { 
                    message = $"WorkCenter with Company={company}, " +
                             $"Contract={contract}, " +
                             $"WorkCenterNo={workCenterNo} not found." 
                });
            }
            
            return Ok(workCenter);
        }

        [HttpDelete("{company}/{contract}/{workCenterNo}")]
        public async Task<IActionResult> DeleteWorkCenter(string company, string contract, string workCenterNo)
        {
            try
            {
                var workCenter = await _context.WorkCenters
                    .FirstOrDefaultAsync(w => 
                        w.Company == company && 
                        w.Contract == contract && 
                        w.WorkCenterNo == workCenterNo);
                
                if (workCenter == null)
                {
                    return NotFound(new { 
                        message = $"WorkCenter with Company={company}, " +
                                 $"Contract={contract}, " +
                                 $"WorkCenterNo={workCenterNo} not found." 
                    });
                }

                _context.WorkCenters.Remove(workCenter);
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = $"WorkCenter with Company={company}, " +
                             $"Contract={contract}, " +
                             $"WorkCenterNo={workCenterNo} deleted successfully." 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // Arama endpoint'i
        [HttpGet("search")]
        public async Task<IActionResult> SearchWorkCenters(
            [FromQuery] string? company,
            [FromQuery] string? contract,
            [FromQuery] string? departmentNo,
            [FromQuery] string? productionLine)
        {
            var query = _context.WorkCenters.AsQueryable();

            if (!string.IsNullOrEmpty(company))
            {
                query = query.Where(w => w.Company == company);
            }

            if (!string.IsNullOrEmpty(contract))
            {
                query = query.Where(w => w.Contract == contract);
            }

            if (!string.IsNullOrEmpty(departmentNo))
            {
                query = query.Where(w => w.DepartmentNo == departmentNo);
            }

            if (!string.IsNullOrEmpty(productionLine))
            {
                query = query.Where(w => w.ProductionLine == productionLine);
            }

            var results = await query.ToListAsync();
            return Ok(results);
        }
    }

    // CREATE için DTO
    public class WorkCenterCreateDto
    {
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public required string WorkCenterNo { get; set; }
        public string? Description { get; set; }
        public string? WorkCenterCode { get; set; }
        public string? ProductionLine { get; set; }
        public string? DepartmentNo { get; set; }
        public string? NoteText { get; set; }
        public string? Rowstate { get; set; }
    }

    // UPDATE için DTO
    public class WorkCenterUpdateDto
    {
        public string? Description { get; set; }
        public string? WorkCenterCode { get; set; }
        public string? ProductionLine { get; set; }
        public string? DepartmentNo { get; set; }
        public string? NoteText { get; set; }
        public string? Rowstate { get; set; }
    }
}