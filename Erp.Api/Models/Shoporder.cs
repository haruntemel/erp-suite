using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Models
{
    [Table("shop_ord_tab")]
    [PrimaryKey(nameof(Contract), nameof(OrderNo), nameof(OrderCode), nameof(PartNo))]
    public class ShopOrder
    {
        [Column("order_no")]
        [MaxLength(48)]
        public required string OrderNo { get; set; }

        [Column("order_code")]
        [MaxLength(12)]
        public required string OrderCode { get; set; }

        [Column("contract")]
        [MaxLength(20)]
        public required string Contract { get; set; }

        [Column("part_no")]
        [MaxLength(100)]
        public required string PartNo { get; set; }

        [Column("revised_start_date")]
        public DateOnly? RevisedStartDate { get; set; }

        [Column("revised_due_date")]
        public DateOnly? RevisedDueDate { get; set; }

        [Column("need_date")]
        public DateOnly? NeedDate { get; set; }

        [Column("complete_date")]
        public DateOnly? CompleteDate { get; set; }

        [Column("revised_qty_due")]
        public decimal? RevisedQtyDue { get; set; }

        [Column("qty_complete")]
        public decimal? QtyComplete { get; set; }

        [Column("operation_scrapped")]
        public decimal? OperationScrapped { get; set; }

        [Column("note_text")]
        [MaxLength(4000)]
        public string? NoteText { get; set; }

        [Column("customer_order_no")]
        [MaxLength(48)]
        public string? CustomerOrderNo { get; set; }

        [Column("customer_line_no")]
        [MaxLength(16)]
        public string? CustomerLineNo { get; set; }

        [Column("customer_rel_no")]
        [MaxLength(16)]
        public string? CustomerRelNo { get; set; }

        [Column("customer_line_item_no")]
        public decimal? CustomerLineItemNo { get; set; }

        [Column("customer_no")]
        [MaxLength(80)]
        public string? CustomerNo { get; set; }

        [Column("project_id")]
        [MaxLength(40)]
        public string? ProjectId { get; set; }

        [Column("activity_seq")]
        public decimal? ActivitySeq { get; set; }

        [Column("owning_customer_no")]
        [MaxLength(80)]
        public string? OwningCustomerNo { get; set; }

        [Column("created_by")]
        [MaxLength(120)]
        public string? CreatedBy { get; set; }

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