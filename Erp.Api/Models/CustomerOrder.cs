namespace Erp.Api.Models
{
    public class CustomerOrder
    {
        public required string Company { get; set; }
        public required string OrderNo { get; set; }
        public required string Contract { get; set; }
        
        // Müşteri bilgileri
        public required string CustomerNo { get; set; }
        public string? CustomerPoNo { get; set; }
        
        // Tarih bilgileri
        public DateOnly DateEntered { get; set; }
        public DateOnly? WantedDeliveryDate { get; set; }
        public DateOnly? PayTermBaseDate { get; set; }
        
        // Ödeme ve teslimat
        public string? CurrencyCode { get; set; }
        public string? PayTermId { get; set; }
        public string? DeliveryTerms { get; set; }
        public string? ShipViaCode { get; set; }
        public string? DeliveryCountryCode { get; set; }
        
        // Diğer bilgiler
        public string? OrderId { get; set; }
        public string? AuthorizeCode { get; set; }
        public string? SalesmanCode { get; set; }
        public string? BillAddrNo { get; set; }
        public string? ShipAddrNo { get; set; }
        public string? InternalPoNo { get; set; }
        public string? NoteText { get; set; }
        public decimal? PaidAmount { get; set; }
        public string? Rowstate { get; set; } // Objstate yerine Rowstate
        
        // Sistem alanları
        public required string CreatedBy { get; set; }
        public required decimal Rowversion { get; set; }
        public required string Rowkey { get; set; }
    }
}