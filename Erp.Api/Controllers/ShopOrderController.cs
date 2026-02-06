using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;
using Erp.Api.DTOs;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopOrderController : ControllerBase
    {
        private readonly ErpDbContext _context;
        private readonly ILogger<ShopOrderController> _logger;

        public ShopOrderController(ErpDbContext context, ILogger<ShopOrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region Query Operations

        /// <summary>
        /// Tüm üretim emirlerini listeler
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShopOrder>>> GetShopOrders()
        {
            try
            {
                var orders = await _context.ShopOrders.ToListAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop orders");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        /// <summary>
        /// Belirli bir üretim emrini getirir
        /// </summary>
        [HttpGet("{contract}/{orderNo}/{orderCode}/{partNo}")]
        public async Task<ActionResult<ShopOrder>> GetShopOrder(
            string contract, 
            string orderNo, 
            string orderCode, 
            string partNo)
        {
            try
            {
                var order = await _context.ShopOrders
                    .FirstOrDefaultAsync(o => 
                        o.Contract == contract && 
                        o.OrderNo == orderNo && 
                        o.OrderCode == orderCode && 
                        o.PartNo == partNo);

                if (order == null)
                {
                    return NotFound(new { message = "Shop order not found." });
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shop order");
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        #endregion

        #region Command Operations

        /// <summary>
        /// Yeni üretim emri oluşturur - CustomerOrder pattern'ine göre (DateOnly kullanarak)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ShopOrder>> CreateShopOrder([FromBody] ShopOrder order)
        {
            try
            {
                // Kontrol: Aynı sipariş zaten var mı?
                var existingOrder = await _context.ShopOrders
                    .FirstOrDefaultAsync(o => 
                        o.Contract == order.Contract && 
                        o.OrderNo == order.OrderNo && 
                        o.OrderCode == order.OrderCode && 
                        o.PartNo == order.PartNo);
                
                if (existingOrder != null)
                {
                    return Conflict(new { message = "Shop order already exists." });
                }

                // Sistem alanlarını set et - CustomerOrder'daki gibi
                order.Rowversion = 1; // CustomerOrder'daki gibi decimal olarak 1 
                order.Rowkey = Guid.NewGuid().ToString();
                order.CreatedBy = User.Identity?.Name ?? "admin";
                
                // Tarih alanları için DateOnly kullan - CustomerOrder'daki gibi
                // Eğer DateOnly? ise zaten doğru formatta
                // Eğer frontend'ten string geliyorsa DateOnly.Parse kullan:
                // order.RevisedStartDate = !string.IsNullOrEmpty(revisedStartDateStr) ? 
                //     DateOnly.Parse(revisedStartDateStr) : (DateOnly?)null;

                // Default değerler - CustomerOrder'daki gibi
                if (string.IsNullOrEmpty(order.Rowstate))
                    order.Rowstate = "Released";
                    
                if (order.RevisedQtyDue == 0)
                    order.RevisedQtyDue = 0;
                    
                if (order.QtyComplete == 0)
                    order.QtyComplete = 0;
                    
                if (order.ActivitySeq == 0)
                    order.ActivitySeq = 0;
                    
                if (order.CustomerLineItemNo == 0)
                    order.CustomerLineItemNo = 0;
                    
                if (order.OperationScrapped == 0)
                    order.OperationScrapped = 0;

                _context.ShopOrders.Add(order);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetShopOrder), 
                    new { 
                        contract = order.Contract, 
                        orderNo = order.OrderNo,
                        orderCode = order.OrderCode,
                        partNo = order.PartNo 
                    }, 
                    order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shop order");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Üretim emrini günceller - CustomerOrder pattern'ine göre (DateOnly kullanarak)
        /// </summary>
        [HttpPut("{contract}/{orderNo}/{orderCode}/{partNo}")]
        public async Task<ActionResult<ShopOrder>> UpdateShopOrder(
            string contract,
            string orderNo,
            string orderCode,
            string partNo,
            [FromBody] ShopOrderUpdateDto updateDto)
        {
            try
            {
                var order = await _context.ShopOrders
                    .FirstOrDefaultAsync(o => 
                        o.Contract == contract && 
                        o.OrderNo == orderNo && 
                        o.OrderCode == orderCode && 
                        o.PartNo == partNo);

                if (order == null)
                {
                    return NotFound(new { message = "Shop order not found." });
                }

                // Rowversion kontrolü - CustomerOrder'daki gibi
                if (order.Rowversion != updateDto.Rowversion)
                {
                    return Conflict(new { message = "Record has been modified by another user." });
                }

                // Güncelleme işlemleri - DateOnly kullanarak
                if (updateDto.RevisedStartDate.HasValue)
                    order.RevisedStartDate = updateDto.RevisedStartDate;
                    
                if (updateDto.RevisedDueDate.HasValue)
                    order.RevisedDueDate = updateDto.RevisedDueDate;
                    
                if (updateDto.NeedDate.HasValue)
                    order.NeedDate = updateDto.NeedDate;
                    
                if (updateDto.CompleteDate.HasValue)
                    order.CompleteDate = updateDto.CompleteDate;
                    
                if (updateDto.RevisedQtyDue.HasValue)
                    order.RevisedQtyDue = updateDto.RevisedQtyDue.Value;
                    
                if (updateDto.QtyComplete.HasValue)
                    order.QtyComplete = updateDto.QtyComplete.Value;
                    
                if (updateDto.OperationScrapped.HasValue)
                    order.OperationScrapped = updateDto.OperationScrapped.Value;
                    
                if (updateDto.NoteText != null)
                    order.NoteText = updateDto.NoteText;
                    
                if (updateDto.CustomerOrderNo != null)
                    order.CustomerOrderNo = updateDto.CustomerOrderNo;
                    
                if (updateDto.CustomerLineNo != null)
                    order.CustomerLineNo = updateDto.CustomerLineNo;
                    
                if (updateDto.CustomerRelNo != null)
                    order.CustomerRelNo = updateDto.CustomerRelNo;
                    
                if (updateDto.CustomerLineItemNo.HasValue)
                    order.CustomerLineItemNo = updateDto.CustomerLineItemNo.Value;
                    
                if (updateDto.CustomerNo != null)
                    order.CustomerNo = updateDto.CustomerNo;
                    
                if (updateDto.ProjectId != null)
                    order.ProjectId = updateDto.ProjectId;
                    
                if (updateDto.ActivitySeq.HasValue)
                    order.ActivitySeq = updateDto.ActivitySeq.Value;
                    
                if (updateDto.OwningCustomerNo != null)
                    order.OwningCustomerNo = updateDto.OwningCustomerNo;
                    
                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                    order.Rowstate = updateDto.Rowstate;

                // Rowversion'ı artır - CustomerOrder'daki gibi
                order.Rowversion++;

                _context.Entry(order).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shop order");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Üretim emrini siler - CustomerOrder pattern'ine göre
        /// </summary>
        [HttpDelete("{contract}/{orderNo}/{orderCode}/{partNo}")]
        public async Task<IActionResult> DeleteShopOrder(
            string contract,
            string orderNo,
            string orderCode,
            string partNo)
        {
            try
            {
                var order = await _context.ShopOrders
                    .FirstOrDefaultAsync(o => 
                        o.Contract == contract && 
                        o.OrderNo == orderNo && 
                        o.OrderCode == orderCode && 
                        o.PartNo == partNo);

                if (order == null)
                {
                    return NotFound(new { message = "Shop order not found." });
                }

                // Önce malzeme tahsislerini sil
                var materials = await _context.ShopMaterialAllocs
                    .Where(m => m.Contract == contract && m.OrderNo == orderNo)
                    .ToListAsync();
                    
                if (materials.Any())
                {
                    _context.ShopMaterialAllocs.RemoveRange(materials);
                }

                _context.ShopOrders.Remove(order);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Shop order deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shop order");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        #endregion

      
    }
}