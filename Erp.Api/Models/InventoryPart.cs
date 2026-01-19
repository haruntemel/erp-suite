using System.ComponentModel.DataAnnotations;

namespace Erp.Api.Models
{
    public class InventoryPart
    {
        // Anahtar alanlar
        public required string Contract { get; set; }                    // VARCHAR2(20)
        public required string PartNo { get; set; }                     // VARCHAR2(100)
        
        // Temel bilgiler
        public string? AccountingGroup { get; set; }                    // VARCHAR2(20)
        public string? CountryOfOrigin { get; set; }                    // VARCHAR2(12) - İLK
        public decimal? EstimatedMaterialCost { get; set; }             // NUMBER(22)
        public string? PartProductCode { get; set; }                    // VARCHAR2(20)
        public string? PartProductFamily { get; set; }                  // VARCHAR2(20)
        public string? PartStatus { get; set; }                         // VARCHAR2(4)
        public string? PlannerBuyer { get; set; }                       // VARCHAR2(80)
        public string? PrimeCommodity { get; set; }                     // VARCHAR2(20)
        public string? SecondCommodity { get; set; }                    // VARCHAR2(20)
        
        // Ölçü birimleri
        public string? UnitMeas { get; set; }                           // VARCHAR2(40)
        public string? SalesUnitMeas { get; set; }                      // VARCHAR2(40)
        
        // Açıklamalar
        public string? Description { get; set; }                        // VARCHAR2(800)
        
       public decimal? ListPrice { get; set; }                         // NUMBER(22)
        public decimal? ListPriceInclTax { get; set; }                  // NUMBER(22)
        public decimal? PriceConvFactor { get; set; }                   // NUMBER(22)
        public string? TaxCode { get; set; }                            // VARCHAR2(80)
        public string? TaxClassId { get; set; }                         // VARCHAR2(80)
        public string? SalesType { get; set; }                          // VARCHAR2(4000)
        public string? SalesTypeDb { get; set; }                        // VARCHAR2(80)
        // Depolama gereksinimleri
        public decimal? StorageWidthRequirement { get; set; }           // NUMBER(22)
        public decimal? StorageHeightRequirement { get; set; }          // NUMBER(22)
        public decimal? StorageDepthRequirement { get; set; }           // NUMBER(22)
        public decimal? StorageVolumeRequirement { get; set; }          // NUMBER(22)
        public decimal? StorageWeightRequirement { get; set; }          // NUMBER(22)
        public decimal? MinStorageTemperature { get; set; }             // NUMBER(22)
        public decimal? MaxStorageTemperature { get; set; }             // NUMBER(22)
        public decimal? MinStorageHumidity { get; set; }                // NUMBER(22)
        public decimal? MaxStorageHumidity { get; set; }                // NUMBER(22)
        
        // Paketleme
        public decimal? StandardPutawayQty { get; set; }                // NUMBER(22)
        public decimal? StandardPackSize { get; set; }                  // NUMBER(22)
        
        // Tarih
        public DateOnly? CreateDate { get; set; }                       // DATE
        public decimal? ExpectedLeadtime { get; set; }                  // NUMBER(22)
        
        // Sistem alanları
        public required decimal Rowversion { get; set; }                // NUMBER(22)
        public required string Rowkey { get; set; }                     // VARCHAR2(200)
    }
}