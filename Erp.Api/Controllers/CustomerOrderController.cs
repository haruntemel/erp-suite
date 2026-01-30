using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerOrderController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public CustomerOrderController(ErpDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerOrders()
        {
            var orders = await _context.CustomerOrders.ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{company}/{orderNo}/{contract}")]
        public async Task<IActionResult> GetCustomerOrder(string company, string orderNo, string contract)
        {
            var order = await _context.CustomerOrders
                .FirstOrDefaultAsync(o => o.Company == company && o.OrderNo == orderNo && o.Contract == contract);
            
            if (order == null)
            {
                return NotFound(new { message = "Customer order not found." });
            }
            
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomerOrder([FromBody] CustomerOrder order)
        {
            try
            {
                // Kontrol: Aynı sipariş zaten var mı?
                var existingOrder = await _context.CustomerOrders
                    .FirstOrDefaultAsync(o => o.Company == order.Company && 
                                             o.OrderNo == order.OrderNo && 
                                             o.Contract == order.Contract);
                
                if (existingOrder != null)
                {
                    return Conflict(new { message = "Customer order already exists." });
                }

                // Sistem alanlarını set et
                order.Rowversion = 1;
                order.Rowkey = Guid.NewGuid().ToString();
                order.DateEntered = DateOnly.FromDateTime(DateTime.Now);
                order.CreatedBy = "admin"; // TODO: Kullanıcıdan al

                _context.CustomerOrders.Add(order);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetCustomerOrder), 
                    new { company = order.Company, orderNo = order.OrderNo, contract = order.Contract }, 
                    order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{company}/{orderNo}/{contract}")]
        public async Task<IActionResult> UpdateCustomerOrder(string company, string orderNo, string contract, 
            [FromBody] CustomerOrderUpdateDto updateDto)
        {
            try
            {
                var order = await _context.CustomerOrders
                    .FirstOrDefaultAsync(o => o.Company == company && 
                                             o.OrderNo == orderNo && 
                                             o.Contract == contract);
                
                if (order == null)
                {
                    return NotFound(new { message = "Customer order not found." });
                }

                // Rowversion kontrolü
                if (order.Rowversion != updateDto.Rowversion)
                {
                    return Conflict(new { message = "Record has been modified by another user." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.CustomerNo))
                    order.CustomerNo = updateDto.CustomerNo;
                    
                if (updateDto.CustomerPoNo != null)
                    order.CustomerPoNo = updateDto.CustomerPoNo;
                    
                if (updateDto.WantedDeliveryDate.HasValue)
                    order.WantedDeliveryDate = updateDto.WantedDeliveryDate.Value;
                    
                if (updateDto.PayTermBaseDate.HasValue)
                    order.PayTermBaseDate = updateDto.PayTermBaseDate.Value;
                    
                if (!string.IsNullOrEmpty(updateDto.CurrencyCode))
                    order.CurrencyCode = updateDto.CurrencyCode;
                    
                if (!string.IsNullOrEmpty(updateDto.PayTermId))
                    order.PayTermId = updateDto.PayTermId;
                    
                if (!string.IsNullOrEmpty(updateDto.DeliveryTerms))
                    order.DeliveryTerms = updateDto.DeliveryTerms;
                    
                if (!string.IsNullOrEmpty(updateDto.ShipViaCode))
                    order.ShipViaCode = updateDto.ShipViaCode;
                    
                if (!string.IsNullOrEmpty(updateDto.DeliveryCountryCode))
                    order.DeliveryCountryCode = updateDto.DeliveryCountryCode;
                    
                if (!string.IsNullOrEmpty(updateDto.OrderId))
                    order.OrderId = updateDto.OrderId;
                    
                if (!string.IsNullOrEmpty(updateDto.AuthorizeCode))
                    order.AuthorizeCode = updateDto.AuthorizeCode;
                    
                if (!string.IsNullOrEmpty(updateDto.SalesmanCode))
                    order.SalesmanCode = updateDto.SalesmanCode;
                    
                if (!string.IsNullOrEmpty(updateDto.BillAddrNo))
                    order.BillAddrNo = updateDto.BillAddrNo;
                    
                if (!string.IsNullOrEmpty(updateDto.ShipAddrNo))
                    order.ShipAddrNo = updateDto.ShipAddrNo;
                    
                if (!string.IsNullOrEmpty(updateDto.InternalPoNo))
                    order.InternalPoNo = updateDto.InternalPoNo;
                    
                if (updateDto.NoteText != null)
                    order.NoteText = updateDto.NoteText;
                    
                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                    order.Rowstate = updateDto.Rowstate;

                // Rowversion'ı artır
                order.Rowversion++;

                _context.Entry(order).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{company}/{orderNo}/{contract}")]
        public async Task<IActionResult> DeleteCustomerOrder(string company, string orderNo, string contract)
        {
            try
            {
                var order = await _context.CustomerOrders
                    .FirstOrDefaultAsync(o => o.Company == company && 
                                             o.OrderNo == orderNo && 
                                             o.Contract == contract);
                
                if (order == null)
                {
                    return NotFound(new { message = "Customer order not found." });
                }

                // Önce sipariş satırlarını sil
                var lines = await _context.CustomerOrderLines
                    .Where(l => l.Company == company && l.OrderNo == orderNo && l.Contract == contract)
                    .ToListAsync();
                    
                if (lines.Any())
                {
                    _context.CustomerOrderLines.RemoveRange(lines);
                }

                _context.CustomerOrders.Remove(order);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Customer order deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfını controller içinde tanımla
        public class CustomerOrderUpdateDto
        {
            public string? CustomerNo { get; set; }
            public string? CustomerPoNo { get; set; }
            public DateOnly? WantedDeliveryDate { get; set; }
            public DateOnly? PayTermBaseDate { get; set; }
            public string? CurrencyCode { get; set; }
            public string? PayTermId { get; set; }
            public string? DeliveryTerms { get; set; }
            public string? ShipViaCode { get; set; }
            public string? DeliveryCountryCode { get; set; }
            public string? OrderId { get; set; }
            public string? AuthorizeCode { get; set; }
            public string? SalesmanCode { get; set; }
            public string? BillAddrNo { get; set; }
            public string? ShipAddrNo { get; set; }
            public string? InternalPoNo { get; set; }
            public string? NoteText { get; set; }
            public string? Rowstate { get; set; }
            public decimal Rowversion { get; set; }
        }
    }
}