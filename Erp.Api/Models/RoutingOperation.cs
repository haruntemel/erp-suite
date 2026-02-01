namespace Erp.Api.Models
{
    public class RoutingOperationTab
    {
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public required string PartNo { get; set; }
        public required string RoutingRevision { get; set; }
        public required string BomType { get; set; }
        public required decimal OperationNo { get; set; }
        public string? OperationDescription { get; set; }
        public string? WorkCenterNo { get; set; }
        public decimal? MachRunFactor { get; set; }
        public decimal? MachSetupTime { get; set; }
        public string? LaborClassNo { get; set; }
        public string? SetupLaborClassNo { get; set; }
        public decimal? CrewSize { get; set; }
        public decimal? SetupCrewSize { get; set; }
        public string? RunTimeCode { get; set; }
        public string? NoteText { get; set; }
        public DateOnly? Rowversion { get; set; }
        public string? Rowkey { get; set; }
        
    }
}