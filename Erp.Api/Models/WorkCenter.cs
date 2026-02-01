namespace Erp.Api.Models
{
    public class WorkCenter
    {
        public required string Company { get; set; }
        public required string Contract { get; set; }
        public required string WorkCenterNo { get; set; }
        public string? Description { get; set; }
        public string? WorkCenterCode { get; set; }
        public string? ProductionLine { get; set; }
        public string? DepartmentNo { get; set; }
        public string? NoteText { get; set; }
        public DateOnly? CreateDate { get; set; }   // 🔹 sadece tarih
        public DateOnly? Rowversion { get; set; }  // 🔹 tarih/sürüm için
        public required string Rowkey { get; set; }
        public string? Rowstate { get; set; }
    }
}