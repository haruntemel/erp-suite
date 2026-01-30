using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Erp.Api.Models
{
    public class ProdStructureHeadTab
    {
        public required string Contract { get; set; }
        public required string PartNo { get; set; }
        public required string EngChgLevel { get; set; }
        public required string BomTypeDb { get; set; }
        public string? NoteText { get; set; }
        public DateTime? EffPhaseInDate { get; set; }
        public DateTime? EffPhaseOutDate { get; set; }
        public required DateTime CreateDate { get; set; }
        public string? Rowstate { get; set; } 
        public required string CreatedBy { get; set; }
        public required decimal Rowversion { get; set; }
        public required string Rowkey { get; set; }
    }
}