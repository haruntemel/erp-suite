namespace Erp.Api.Models
{
    public class Company
    {
        public required string CompanyId { get; set; }
        public required string Name { get; set; }
        public DateOnly CreationDate { get; set; }   // 🔹 sadece tarih
        public string? AssociationNo { get; set; }
        public required string DefaultLanguage { get; set; }
        public string? Logotype { get; set; }
        public string? CorporateForm { get; set; }
        public required string Country { get; set; }
        public required string CreatedBy { get; set; }
        public required string LocalizationCountry { get; set; }
        public required decimal Rowversion { get; set; }
        public required string Rowkey { get; set; }
    }
}