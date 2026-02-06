using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using Erp.Api.DTOs;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopMaterialAllocController : ControllerBase
    {
        private readonly ErpDbContext _context;
        private readonly ILogger<ShopMaterialAllocController> _logger;

        public ShopMaterialAllocController(ErpDbContext context, ILogger<ShopMaterialAllocController> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region Query Operations

        [HttpGet("by-order/{contract}/{orderNo}")]
        public async Task<ActionResult<IEnumerable<ShopMaterialAlloc>>> GetMaterialsByOrder(
            string contract, 
            string orderNo)
        {
            try
            {
                var materials = await _context.ShopMaterialAllocs
                    .Where(m => m.Contract == contract && m.OrderNo == orderNo)
                    .OrderBy(m => m.LineItemNo)
                    .ToListAsync();

                return Ok(materials);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving materials for order {OrderNo}", orderNo);
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet("{contract}/{orderNo}/{lineItemNo}/{partNo}")]
        public async Task<ActionResult<ShopMaterialAlloc>> GetMaterialAlloc(
            string contract,
            string orderNo,
            decimal lineItemNo,
            string partNo)
        {
            try
            {
                var material = await _context.ShopMaterialAllocs
                    .FirstOrDefaultAsync(m => 
                        m.Contract == contract && 
                        m.OrderNo == orderNo && 
                        m.LineItemNo == lineItemNo && 
                        m.PartNo == partNo);

                if (material == null)
                {
                    return NotFound(new { message = "Material allocation not found." });
                }

                return Ok(material);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving material allocation");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        #endregion

        #region Command Operations

        [HttpPost]
        public async Task<ActionResult<ShopMaterialAlloc>> CreateMaterialAlloc([FromBody] ShopMaterialAlloc material)
        {
            try
            {
                // Üretim emrinin var olduğunu kontrol et
                var orderExists = await _context.ShopOrders
                    .AnyAsync(o => o.Contract == material.Contract && o.OrderNo == material.OrderNo);

                if (!orderExists)
                {
                    return NotFound(new { message = "Shop order not found." });
                }

                // Duplicate kontrolü
                var exists = await _context.ShopMaterialAllocs
                    .AnyAsync(m => 
                        m.Contract == material.Contract && 
                        m.OrderNo == material.OrderNo && 
                        m.LineItemNo == material.LineItemNo && 
                        m.PartNo == material.PartNo);

                if (exists)
                {
                    return Conflict(new { message = "Material allocation already exists." });
                }

                // Sistem alanlarını set et - CustomerOrder pattern'ine göre
                material.Rowversion = 1; // decimal olarak 1
                material.Rowkey = Guid.NewGuid().ToString();
                
                if (string.IsNullOrEmpty(material.Rowstate))
                    material.Rowstate = "Active";
                    
                if (material.CreateDate == null)
                    material.CreateDate = DateOnly.FromDateTime(DateTime.Today);

                _context.ShopMaterialAllocs.Add(material);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(
                    nameof(GetMaterialAlloc),
                    new { 
                        contract = material.Contract, 
                        orderNo = material.OrderNo, 
                        lineItemNo = material.LineItemNo, 
                        partNo = material.PartNo 
                    },
                    material);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating material allocation");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{contract}/{orderNo}/{lineItemNo}/{partNo}")]
        public async Task<ActionResult<ShopMaterialAlloc>> UpdateMaterialAlloc(
            string contract,
            string orderNo,
            decimal lineItemNo,
            string partNo,
            [FromBody] ShopMaterialAllocUpdateDto updateDto)
        {
            try
            {
                var material = await _context.ShopMaterialAllocs
                    .FirstOrDefaultAsync(m => 
                        m.Contract == contract && 
                        m.OrderNo == orderNo && 
                        m.LineItemNo == lineItemNo && 
                        m.PartNo == partNo);

                if (material == null)
                {
                    return NotFound(new { message = "Material allocation not found." });
                }

                // Rowversion kontrolü - decimal olarak
                if (material.Rowversion != updateDto.Rowversion)
                {
                    return Conflict(new { message = "Record has been modified by another user." });
                }

                // Güncelleme işlemleri
                if (updateDto.OperationNo.HasValue)
                    material.OperationNo = updateDto.OperationNo;

                if (updateDto.QtyAssigned.HasValue)
                    material.QtyAssigned = updateDto.QtyAssigned;

                if (updateDto.QtyIssued.HasValue)
                    material.QtyIssued = updateDto.QtyIssued;

                if (updateDto.QtyPerAssembly.HasValue)
                    material.QtyPerAssembly = updateDto.QtyPerAssembly;

                if (updateDto.QtyRequired.HasValue)
                    material.QtyRequired = updateDto.QtyRequired;

                if (updateDto.NoteText != null)
                    material.NoteText = updateDto.NoteText;

                if (updateDto.ActivitySeq.HasValue)
                    material.ActivitySeq = updateDto.ActivitySeq;

                if (updateDto.ProjectId != null)
                    material.ProjectId = updateDto.ProjectId;

                if (updateDto.CatchQtyIssued.HasValue)
                    material.CatchQtyIssued = updateDto.CatchQtyIssued;

                if (updateDto.QtyScr.HasValue)
                    material.QtyScr = updateDto.QtyScr;

                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                    material.Rowstate = updateDto.Rowstate;

                // Rowversion'ı artır - decimal olarak
                material.Rowversion++;

                _context.Entry(material).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                return Ok(material);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating material allocation");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{contract}/{orderNo}/{lineItemNo}/{partNo}")]
        public async Task<IActionResult> DeleteMaterialAlloc(
            string contract,
            string orderNo,
            decimal lineItemNo,
            string partNo)
        {
            try
            {
                var material = await _context.ShopMaterialAllocs
                    .FirstOrDefaultAsync(m => 
                        m.Contract == contract && 
                        m.OrderNo == orderNo && 
                        m.LineItemNo == lineItemNo && 
                        m.PartNo == partNo);

                if (material == null)
                {
                    return NotFound(new { message = "Material allocation not found." });
                }

                _context.ShopMaterialAllocs.Remove(material);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Material allocation deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting material allocation");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        #endregion

        
    }
}