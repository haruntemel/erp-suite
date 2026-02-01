namespace Erp.Api.Models
{
    public class CompanySite
    {
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public DateOnly? CreateDate { get; set; }
        public DateOnly? Rowversion { get; set; }
        public required string Rowkey { get; set; }
        public string? Rowstate { get; set; }
    }
}