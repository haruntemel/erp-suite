using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Erp.Api.Models
{
    [Table("customer_info")]
    public class CustomerInfo
    {
        [Key]
        [Column("customer_id")]
        [Required]
        [MaxLength(80)]
        public string CustomerId { get; set; } = string.Empty;

        [Column("name")]
        [Required]
        [MaxLength(400)]
        public string Name { get; set; } = string.Empty;

        [Column("association_no")]
        [MaxLength(200)]
        public string? AssociationNo { get; set; }

        [Column("corporate_form")]
        [MaxLength(32)]
        public string? CorporateForm { get; set; }

        [Column("country")]
        [Required]
        [MaxLength(8)]
        public string Country { get; set; } = "TR";

        [Column("party_type")]
        [MaxLength(80)]
        public string? PartyType { get; set; }

        [Column("category")]
        [MaxLength(80)]
        public string? Category { get; set; }

        [Column("check_limit")]
        [MaxLength(20)]
        public string? CheckLimit { get; set; }

        [Column("limit_control_type")]
        [MaxLength(80)]
        public string? LimitControlType { get; set; }

        [Column("default_language")]
        [Required]
        [MaxLength(8)]
        public string DefaultLanguage { get; set; } = "tr";

        [Column("created_by")]
        [Required]
        [MaxLength(80)]
        public string CreatedBy { get; set; } = string.Empty;

        [Column("changed_by")]
        [MaxLength(80)]
        public string? ChangedBy { get; set; }

        [Column("creation_date")]
        [Required]
        public DateOnly CreationDate { get; set; }

        [Column("identifier_reference")]
        [MaxLength(400)]
        public string? IdentifierReference { get; set; }

        [Column("rowversion")]
        [Required]
        public decimal Rowversion { get; set; } = 1; // DECIMAL olarak

        [Column("rowkey")]
        [Required]
        [MaxLength(200)]
        public string Rowkey { get; set; } = string.Empty;

        [Column("rowtype")]
        [MaxLength(120)]
        public string? Rowtype { get; set; }
    }
}