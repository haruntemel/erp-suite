using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Erp.Api.Models
{
    public class ProdStructureTab
    {
        public required string Contract { get; set; }
        public required string PartNo { get; set; }
        public required string EngChgLevel { get; set; }
        public required string BomTypeDb { get; set; }
        public required string AlternativeNo { get; set; }
        
        // Sayısal alanlar (NUMBER tipi)
        public required decimal LineItemNo { get; set; }
        public required decimal LineSequence { get; set; }
        public required decimal OperationNo { get; set; }
        
        // Diğer alanlar
        public string? NoteText { get; set; }
        public string? Source { get; set; }
        public required DateTime CreateDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
        public string? ComponentPart { get; set; }
        public string? Rowstate { get; set; } 
        public required string CreatedBy { get; set; }
        public required decimal Rowversion { get; set; }
        public required string Rowkey { get; set; }
    }
}