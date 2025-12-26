// Models/Product.cs
using System;

namespace Erp.Api.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}