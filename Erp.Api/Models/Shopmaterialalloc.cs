using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Models
{
    [Table("shop_material_alloc_tab")]
    [PrimaryKey(nameof(Contract), nameof(OrderNo), nameof(LineItemNo), nameof(PartNo))]
    public class ShopMaterialAlloc
    {
        [Column("contract")]
        [MaxLength(20)]
        public required string Contract { get; set; }

        [Column("order_no")]
        [MaxLength(48)]
        public required string OrderNo { get; set; }

        [Column("line_item_no")]
        public required decimal LineItemNo { get; set; }

        [Column("part_no")]
        [MaxLength(100)]
        public required string PartNo { get; set; }

        [Column("operation_no")]
        public decimal? OperationNo { get; set; }

        [Column("create_date")]
        public DateOnly? CreateDate { get; set; }

        [Column("qty_assigned")]
        public decimal? QtyAssigned { get; set; }

        [Column("qty_issued")]
         public decimal? QtyIssued { get; set; }

        [Column("qty_per_assembly")]
        public decimal? QtyPerAssembly { get; set; }

        [Column("qty_required")]
        public decimal? QtyRequired { get; set; }

        [Column("note_text")]
        [MaxLength(4000)]
        public string? NoteText { get; set; }

        [Column("activity_seq")]
        public decimal? ActivitySeq { get; set; }

        [Column("project_id")]
        [MaxLength(40)]
        public string? ProjectId { get; set; }

        [Column("catch_qty_issued")]
        public decimal? CatchQtyIssued { get; set; }

        [Column("qty_scrapped_component")]
        public decimal? QtyScr  { get; set; }

        [Column("rowversion")]
       public decimal Rowversion { get; set; }

        [Column("rowkey")]
        [MaxLength(200)]
        public string? Rowkey { get; set; }

        [Column("rowstate")]
        [MaxLength(80)]
        public string? Rowstate { get; set; }
    }
}