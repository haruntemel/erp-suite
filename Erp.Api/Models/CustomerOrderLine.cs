namespace Erp.Api.Models
{
    public class CustomerOrderLine
    {
        // Anahtar alanlar
        public required string OrderNo { get; set; }
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public required string LineNo { get; set; }
        public required string RelNo { get; set; }
        
        // Malzeme bilgileri
        public required string CatalogNo { get; set; }
        public required string PartNo { get; set; }
        public string? CustomerPartNo { get; set; }
        public string? CatalogDesc { get; set; }
        public string? CatalogType { get; set; }
        
        // Miktar ve fiyat
        public decimal? BuyQtyDue { get; set; }
        public decimal? CustomerPartBuyQty { get; set; }
        public decimal? BaseSaleUnitPrice { get; set; }
        public decimal? BaseUnitPriceInclTax { get; set; }
        public decimal? SaleUnitPrice { get; set; }
        public decimal? UnitPriceInclTax { get; set; }
        
        // Ölçü birimleri
        public string? SalesUnitMeas { get; set; }
        public string? PriceUnitMeas { get; set; }
        public string? CustomerPartUnitMeas { get; set; }
        
        // Döviz ve indirim
        public decimal? CurrencyRate { get; set; }
        public decimal? Discount { get; set; }
        public decimal? AdditionalDiscount { get; set; }
        public decimal? PriceConvFactor { get; set; }
        public decimal? CustomerPartConvFactor { get; set; }
        
        // Tarih bilgileri
        public DateOnly? DateEntered { get; set; }
        public DateOnly? PlannedDeliveryDate { get; set; }
        public DateOnly? PlannedDueDate { get; set; }
        public DateOnly? PromisedDeliveryDate { get; set; }
        public DateOnly? RealShipDate { get; set; }
        public DateOnly? WantedDeliveryDate { get; set; }
        public DateOnly? PlannedShipDate { get; set; }
        public DateOnly? FirstActualShipDate { get; set; }
        public DateOnly? TargetDate { get; set; }
        
        // Diğer bilgiler
        public decimal? LineItemNo { get; set; }
        public string? OrderCode { get; set; }
        public string? DeliveryType { get; set; }
        public string? TaxCode { get; set; }
        public string? NoteText { get; set; }
        public string? CustomerNo { get; set; }
        public string? ForwardAgentId { get; set; }
        public string? ShipViaCode { get; set; }
        public string? DeliveryTerms { get; set; }
        public string? PartOwnership { get; set; }
        public decimal? ActivitySeq { get; set; }
        public string? ProjectId { get; set; }
        public string? CustomerPoLineNo { get; set; }
        public string? FreeOfCharge { get; set; }
        public string? State { get; set; }
        
        // Sistem alanları
        public required decimal Rowversion { get; set; }
        public required string Rowkey { get; set; }
    }
}