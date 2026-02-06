namespace Erp.Api.DTOs
{
    /// <summary>
    /// Malzeme tahsisi oluşturma için DTO
    /// </summary>
    public class ShopMaterialAllocCreateDto
    {
        public required string Contract { get; set; }
        public required string OrderNo { get; set; }
        public required decimal LineItemNo { get; set; }
        public required string PartNo { get; set; }
        public decimal? OperationNo { get; set; }
        public decimal? QtyAssigned { get; set; }
        public decimal? QtyPerAssembly { get; set; }
        public decimal? QtyRequired { get; set; }
        public string? NoteText { get; set; }
        public decimal? ActivitySeq { get; set; }
        public string? ProjectId { get; set; }
        public string? Rowstate { get; set; }
    }

    /// <summary>
    /// Malzeme tahsisi güncelleme için DTO
    /// </summary>
    public class ShopMaterialAllocUpdateDto
    {
        public decimal? OperationNo { get; set; }
        public decimal? QtyAssigned { get; set; }
        public decimal? QtyIssued { get; set; }
        public decimal? QtyPerAssembly { get; set; }
        public decimal? QtyRequired { get; set; }
        public string? NoteText { get; set; }
        public decimal? ActivitySeq { get; set; }
        public string? ProjectId { get; set; }
        public decimal? CatchQtyIssued { get; set; }
        public decimal? QtyScr  { get; set; }
        public string? Rowstate { get; set; }
        public decimal Rowversion { get; set; }
    }

    /// <summary>
    /// Malzeme tahsisi listeleme için DTO
    /// </summary>
    public class ShopMaterialAllocListDto
    {
        public string Contract { get; set; } = string.Empty;
        public string OrderNo { get; set; } = string.Empty;
        public decimal LineItemNo { get; set; }
        public string PartNo { get; set; } = string.Empty;
        public decimal? OperationNo { get; set; }
        public decimal? QtyAssigned { get; set; }
        public decimal? QtyIssued { get; set; }
        public decimal? QtyRequired { get; set; }
        public string? Rowstate { get; set; }
    }
}