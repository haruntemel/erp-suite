namespace Erp.Api.Models
{
    public class RoutingHeadTab
    {
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public required string PartNo { get; set; }
        public required string RoutingRevision { get; set; }
        public required string BomType { get; set; }
        public DateOnly? PhaseInDate { get; set; }
        public DateOnly? PhaseOutDate { get; set; }
        public decimal? NoteId { get; set; }
        public string? NoteText { get; set; }
        public DateOnly? CreateDate { get; set; }
        public DateOnly? Rowversion { get; set; }
        public string? Rowkey { get; set; }
        
    }
}