using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Data;
using Erp.Api.Models;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerOrderLineController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public CustomerOrderLineController(ErpDbContext context)
        {
            _context = context;
        }

        // YENİ EKLENDİ: Tüm sipariş satırlarını getir
        [HttpGet("get-all")]
public async Task<IActionResult> GetAllOrderLines()
{
    try
    {
        var lines = await _context.CustomerOrderLines
            .OrderByDescending(l => l.DateEntered)
            .Take(1000)
            .ToListAsync();
            
        Console.WriteLine($"GetAllOrderLines: {lines.Count} satır döndü");
        return Ok(lines);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"GetAllOrderLines hatası: {ex.Message}");
        return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
    }
}

        // GELİŞMİŞ VERSİYON: Arama ve sayfalama ile
        [HttpGet("search")]
        public async Task<IActionResult> SearchOrderLines(
    [FromQuery] string? search = null,
    [FromQuery] string? orderNo = null,
    [FromQuery] string? partNo = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.CustomerOrderLines.AsQueryable();
                
                // Arama filtresi
                if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(l => 
                (l.PartNo != null && l.PartNo.Contains(search)) ||
                (l.CatalogDesc != null && l.CatalogDesc.Contains(search)) ||
                (l.OrderNo != null && l.OrderNo.Contains(search)) ||
                (l.CustomerNo != null && l.CustomerNo.Contains(search)));
        }
                
                 // Sipariş numarası filtresi
        if (!string.IsNullOrEmpty(orderNo))
        {
            query = query.Where(l => l.OrderNo != null && l.OrderNo.Contains(orderNo));
        }
        
        // Malzeme numarası filtresi
        if (!string.IsNullOrEmpty(partNo))
        {
            query = query.Where(l => l.PartNo != null && l.PartNo.Contains(partNo));
        }
                
                // Toplam kayıt sayısı
                var totalCount = await query.CountAsync();
                
                // Sayfalama
                var items = await query
                    .OrderByDescending(l => l.DateEntered)
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

     [HttpGet("order/{company}/{orderNo}/{contract}")]
public async Task<IActionResult> GetOrderLines(string company, string orderNo, string contract)
{
    try
    {
        var lines = await _context.CustomerOrderLines
            .Where(l => l.Company == company && l.OrderNo == orderNo && l.Contract == contract)
            .OrderBy(l => l.LineNo)
            .ToListAsync();
            
        // Null kontrolü ekleyerek warning'i düzelt
        if (lines == null || lines.Count == 0)
        {
            return Ok(new List<CustomerOrderLine>()); // Boş liste dön
        }
            
        return Ok(lines);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
    }
}

        [HttpGet("{company}/{orderNo}/{contract}/{lineNo}/{relNo}")]
        public async Task<IActionResult> GetOrderLine(string company, string orderNo, string contract, 
            string lineNo, string relNo)
        {
            try
            {
                var line = await _context.CustomerOrderLines
                    .FirstOrDefaultAsync(l => l.Company == company && 
                                             l.OrderNo == orderNo && 
                                             l.Contract == contract &&
                                             l.LineNo == lineNo &&
                                             l.RelNo == relNo);
                
                if (line == null)
                {
                    return NotFound(new { message = "Order line not found." });
                }
                
                return Ok(line);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("order/{company}/{orderNo}/{contract}")]
        public async Task<IActionResult> AddOrderLine(string company, string orderNo, string contract, 
            [FromBody] CustomerOrderLineCreateDto createDto)
        {
            try
            {
                // Siparişin var olduğunu kontrol et
                var order = await _context.CustomerOrders
                    .FirstOrDefaultAsync(o => o.Company == company && 
                                             o.OrderNo == orderNo && 
                                             o.Contract == contract);
                
                if (order == null)
                {
                    return NotFound(new { message = "Customer order not found." });
                }

                // Aynı satır numarası kontrolü
                var existingLine = await _context.CustomerOrderLines
                    .FirstOrDefaultAsync(l => l.Company == company && 
                                             l.OrderNo == orderNo && 
                                             l.Contract == contract && 
                                             l.LineNo == createDto.LineNo && 
                                             l.RelNo == createDto.RelNo);
                
                if (existingLine != null)
                {
                    return Conflict(new { message = "Order line already exists." });
                }

                // Yeni satır oluştur
                var line = new CustomerOrderLine
                {
                    Company = company,
                    OrderNo = orderNo,
                    Contract = contract,
                    LineNo = createDto.LineNo,
                    RelNo = createDto.RelNo,
                    CatalogNo = createDto.CatalogNo,
                    PartNo = createDto.PartNo,
                    CustomerPartNo = createDto.CustomerPartNo,
                    CatalogDesc = createDto.CatalogDesc,
                    CatalogType = "STANDARD",
                    BuyQtyDue = createDto.BuyQtyDue,
                    CustomerPartBuyQty = createDto.CustomerPartBuyQty,
                    BaseSaleUnitPrice = createDto.BaseSaleUnitPrice,
                    SaleUnitPrice = createDto.SaleUnitPrice,
                    UnitPriceInclTax = createDto.UnitPriceInclTax,
                    SalesUnitMeas = createDto.SalesUnitMeas,
                    PriceUnitMeas = createDto.PriceUnitMeas,
                    Discount = createDto.Discount,
                    AdditionalDiscount = createDto.AdditionalDiscount,
                    PriceConvFactor = 1,
                    CustomerPartConvFactor = createDto.CustomerPartConvFactor,
                    DateEntered = DateOnly.FromDateTime(DateTime.Now),
                    PlannedDeliveryDate = createDto.PlannedDeliveryDate,
                    PromisedDeliveryDate = createDto.PromisedDeliveryDate,
                    WantedDeliveryDate = createDto.WantedDeliveryDate,
                    DeliveryType = createDto.DeliveryType,
                    TaxCode = createDto.TaxCode,
                    NoteText = createDto.NoteText,
                    CustomerNo = order.CustomerNo,
                    ForwardAgentId = createDto.ForwardAgentId,
                    ShipViaCode = createDto.ShipViaCode,
                    DeliveryTerms = createDto.DeliveryTerms,
                    ProjectId = createDto.ProjectId,
                    FreeOfCharge = createDto.FreeOfCharge,
                    Rowstate = createDto.Rowstate,
                    OrderCode = "ORDER",
                    Rowversion = 1,
                    Rowkey = Guid.NewGuid().ToString()
                };

                _context.CustomerOrderLines.Add(line);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetOrderLine), 
                    new { 
                        company = company, 
                        orderNo = orderNo, 
                        contract = contract, 
                        lineNo = line.LineNo, 
                        relNo = line.RelNo 
                    }, 
                    line);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{company}/{orderNo}/{contract}/{lineNo}/{relNo}")]
        public async Task<IActionResult> UpdateOrderLine(string company, string orderNo, string contract, 
            string lineNo, string relNo, [FromBody] CustomerOrderLineUpdateDto updateDto)
        {
            try
            {
                var line = await _context.CustomerOrderLines
                    .FirstOrDefaultAsync(l => l.Company == company && 
                                             l.OrderNo == orderNo && 
                                             l.Contract == contract &&
                                             l.LineNo == lineNo &&
                                             l.RelNo == relNo);
                
                if (line == null)
                {
                    return NotFound(new { message = "Order line not found." });
                }

                // Rowversion kontrolü
                if (line.Rowversion != updateDto.Rowversion)
                {
                    return Conflict(new { message = "Record has been modified by another user." });
                }

                // Güncelleme işlemleri
                if (!string.IsNullOrEmpty(updateDto.CatalogNo))
                    line.CatalogNo = updateDto.CatalogNo;
                    
                if (!string.IsNullOrEmpty(updateDto.PartNo))
                    line.PartNo = updateDto.PartNo;
                    
                if (updateDto.CustomerPartNo != null)
                    line.CustomerPartNo = updateDto.CustomerPartNo;
                    
                if (updateDto.CatalogDesc != null)
                    line.CatalogDesc = updateDto.CatalogDesc;
                    
                if (updateDto.BuyQtyDue.HasValue)
                    line.BuyQtyDue = updateDto.BuyQtyDue.Value;
                    
                if (updateDto.CustomerPartBuyQty.HasValue)
                    line.CustomerPartBuyQty = updateDto.CustomerPartBuyQty.Value;
                    
                if (updateDto.BaseSaleUnitPrice.HasValue)
                    line.BaseSaleUnitPrice = updateDto.BaseSaleUnitPrice.Value;
                    
                if (updateDto.SaleUnitPrice.HasValue)
                    line.SaleUnitPrice = updateDto.SaleUnitPrice.Value;
                    
                if (updateDto.UnitPriceInclTax.HasValue)
                    line.UnitPriceInclTax = updateDto.UnitPriceInclTax.Value;
                    
                if (!string.IsNullOrEmpty(updateDto.SalesUnitMeas))
                    line.SalesUnitMeas = updateDto.SalesUnitMeas;
                    
                if (!string.IsNullOrEmpty(updateDto.PriceUnitMeas))
                    line.PriceUnitMeas = updateDto.PriceUnitMeas;
                    
                if (updateDto.Discount.HasValue)
                    line.Discount = updateDto.Discount.Value;
                    
                if (updateDto.AdditionalDiscount.HasValue)
                    line.AdditionalDiscount = updateDto.AdditionalDiscount.Value;
                    
                if (updateDto.CustomerPartConvFactor.HasValue)
                    line.CustomerPartConvFactor = updateDto.CustomerPartConvFactor.Value;
                    
                if (updateDto.PlannedDeliveryDate.HasValue)
                    line.PlannedDeliveryDate = updateDto.PlannedDeliveryDate.Value;
                    
                if (updateDto.PromisedDeliveryDate.HasValue)
                    line.PromisedDeliveryDate = updateDto.PromisedDeliveryDate.Value;
                    
                if (updateDto.WantedDeliveryDate.HasValue)
                    line.WantedDeliveryDate = updateDto.WantedDeliveryDate.Value;
                    
                if (!string.IsNullOrEmpty(updateDto.DeliveryType))
                    line.DeliveryType = updateDto.DeliveryType;
                    
                if (!string.IsNullOrEmpty(updateDto.TaxCode))
                    line.TaxCode = updateDto.TaxCode;
                    
                if (updateDto.NoteText != null)
                    line.NoteText = updateDto.NoteText;
                    
                if (!string.IsNullOrEmpty(updateDto.ForwardAgentId))
                    line.ForwardAgentId = updateDto.ForwardAgentId;
                    
                if (!string.IsNullOrEmpty(updateDto.ShipViaCode))
                    line.ShipViaCode = updateDto.ShipViaCode;
                    
                if (!string.IsNullOrEmpty(updateDto.DeliveryTerms))
                    line.DeliveryTerms = updateDto.DeliveryTerms;
                    
                if (!string.IsNullOrEmpty(updateDto.ProjectId))
                    line.ProjectId = updateDto.ProjectId;
                    
                if (!string.IsNullOrEmpty(updateDto.FreeOfCharge))
                    line.FreeOfCharge = updateDto.FreeOfCharge;
                    
                if (!string.IsNullOrEmpty(updateDto.Rowstate))
                    line.Rowstate = updateDto.Rowstate;

                // Rowversion'ı artır
                line.Rowversion++;

                await _context.SaveChangesAsync();
                
                return Ok(line);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{company}/{orderNo}/{contract}/{lineNo}/{relNo}")]
        public async Task<IActionResult> DeleteOrderLine(string company, string orderNo, string contract, 
            string lineNo, string relNo)
        {
            try
            {
                var line = await _context.CustomerOrderLines
                    .FirstOrDefaultAsync(l => l.Company == company && 
                                             l.OrderNo == orderNo && 
                                             l.Contract == contract &&
                                             l.LineNo == lineNo &&
                                             l.RelNo == relNo);
                
                if (line == null)
                {
                    return NotFound(new { message = "Order line not found." });
                }

                _context.CustomerOrderLines.Remove(line);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Order line deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DTO sınıfları
        public class CustomerOrderLineCreateDto
        {
            public required string LineNo { get; set; }
            public required string RelNo { get; set; }
            public required string CatalogNo { get; set; }
            public required string PartNo { get; set; }
            public string? CustomerPartNo { get; set; }
            public string? CatalogDesc { get; set; }
            public decimal? BuyQtyDue { get; set; }
            public decimal? CustomerPartBuyQty { get; set; }
            public decimal? BaseSaleUnitPrice { get; set; }
            public decimal? SaleUnitPrice { get; set; }
            public decimal? UnitPriceInclTax { get; set; }
            public string? SalesUnitMeas { get; set; }
            public string? PriceUnitMeas { get; set; }
            public decimal? Discount { get; set; }
            public decimal? AdditionalDiscount { get; set; }
            public decimal? CustomerPartConvFactor { get; set; }
            public DateOnly? PlannedDeliveryDate { get; set; }
            public DateOnly? PromisedDeliveryDate { get; set; }
            public DateOnly? WantedDeliveryDate { get; set; }
            public string? DeliveryType { get; set; }
            public string? TaxCode { get; set; }
            public string? NoteText { get; set; }
            public string? ForwardAgentId { get; set; }
            public string? ShipViaCode { get; set; }
            public string? DeliveryTerms { get; set; }
            public string? ProjectId { get; set; }
            public string? FreeOfCharge { get; set; }
            public string? Rowstate { get; set; }
        }

        public class CustomerOrderLineUpdateDto
        {
            public string? CatalogNo { get; set; }
            public string? PartNo { get; set; }
            public string? CustomerPartNo { get; set; }
            public string? CatalogDesc { get; set; }
            public decimal? BuyQtyDue { get; set; }
            public decimal? CustomerPartBuyQty { get; set; }
            public decimal? BaseSaleUnitPrice { get; set; }
            public decimal? SaleUnitPrice { get; set; }
            public decimal? UnitPriceInclTax { get; set; }
            public string? SalesUnitMeas { get; set; }
            public string? PriceUnitMeas { get; set; }
            public decimal? Discount { get; set; }
            public decimal? AdditionalDiscount { get; set; }
            public decimal? CustomerPartConvFactor { get; set; }
            public DateOnly? PlannedDeliveryDate { get; set; }
            public DateOnly? PromisedDeliveryDate { get; set; }
            public DateOnly? WantedDeliveryDate { get; set; }
            public string? DeliveryType { get; set; }
            public string? TaxCode { get; set; }
            public string? NoteText { get; set; }
            public string? ForwardAgentId { get; set; }
            public string? ShipViaCode { get; set; }
            public string? DeliveryTerms { get; set; }
            public string? ProjectId { get; set; }
            public string? FreeOfCharge { get; set; }
            public string? Rowstate { get; set; }
            public decimal Rowversion { get; set; }
        }
    }
}