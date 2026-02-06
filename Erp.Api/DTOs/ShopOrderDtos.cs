namespace Erp.Api.DTOs
{
    /// <summary>
    /// Üretim emri oluşturma için DTO
    /// </summary>
    public class ShopOrderCreateDto
    {
        public required string OrderNo { get; set; }
        public required string OrderCode { get; set; }
        public required string Contract { get; set; }
        public required string PartNo { get; set; }
        public DateOnly? RevisedStartDate { get; set; }
        public DateOnly? RevisedDueDate { get; set; }
        public DateOnly? NeedDate { get; set; }
        public decimal? RevisedQtyDue { get; set; }
        public string? NoteText { get; set; }
        public string? CustomerOrderNo { get; set; }
        public string? CustomerLineNo { get; set; }
        public string? CustomerRelNo { get; set; }
        public decimal? CustomerLineItemNo { get; set; }
        public string? CustomerNo { get; set; }
        public string? ProjectId { get; set; }
        public decimal? ActivitySeq { get; set; }
        public string? OwningCustomerNo { get; set; }
        public string? Rowstate { get; set; }
    }

    /// <summary>
    /// Üretim emri güncelleme için DTO
    /// </summary>
    public class ShopOrderUpdateDto
    {
        public DateOnly? RevisedStartDate { get; set; }
        public DateOnly? RevisedDueDate { get; set; }
        public DateOnly? NeedDate { get; set; }
        public DateOnly? CompleteDate { get; set; }
        public decimal? RevisedQtyDue { get; set; }
        public decimal? QtyComplete { get; set; }
        public decimal? OperationScrapped { get; set; }
        public string? NoteText { get; set; }
        public string? CustomerOrderNo { get; set; }
        public string? CustomerLineNo { get; set; }
        public string? CustomerRelNo { get; set; }
        public decimal? CustomerLineItemNo { get; set; }
        public string? CustomerNo { get; set; }
        public string? ProjectId { get; set; }
        public decimal? ActivitySeq { get; set; }
        public string? OwningCustomerNo { get; set; }
        public string? Rowstate { get; set; }
        public decimal Rowversion { get; set; }
    }

    /// <summary>
    /// Üretim emri listeleme için DTO (daha hafif, sadece gerekli alanlar)
    /// </summary>
    public class ShopOrderListDto
    {
        public string OrderNo { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public string Contract { get; set; } = string.Empty;
        public string PartNo { get; set; } = string.Empty;
        public DateOnly? RevisedStartDate { get; set; }
        public DateOnly? RevisedDueDate { get; set; }
        public decimal? RevisedQtyDue { get; set; }
        public decimal? QtyComplete { get; set; }
        public string? CustomerOrderNo { get; set; }
        public string? CustomerNo { get; set; } 
        public string? Rowstate { get; set; }
    }
}