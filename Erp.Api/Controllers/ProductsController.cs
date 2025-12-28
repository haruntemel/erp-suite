// Controllers/ProductsController.cs
using System;
using System.Linq;
using Erp.Api.Data;
using Erp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Erp.Api.Controllers
{
    // OData route'u Program.cs'de verildiği için burada route attribute'u kullanmıyoruz.
    public class ProductsController : ODataController
    {
        private readonly ErpDbContext _db;
        public ProductsController(ErpDbContext db) => _db = db;

        // OData query özelliklerini (filter, select, orderby vs.) açar
        [EnableQuery]
        public IQueryable<Product> Get() => _db.Products;

        // OData POST ile yeni ürün ekleme
        public IActionResult Post([FromBody] Product product)
        {
            product.Id = Guid.NewGuid();
            _db.Products.Add(product);
            _db.SaveChanges();
            return Created(product);
        }
    }
}