using Microsoft.EntityFrameworkCore;
using Erp.Api.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Erp.Api.Data
{
    public class ErpDbContext : DbContext
    {
        public ErpDbContext(DbContextOptions<ErpDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Product> Products => Set<Product>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Permission> Permissions => Set<Permission>();
        public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<CustomerInfo> Customers => Set<CustomerInfo>();
        public DbSet<InventoryPart> InventoryParts => Set<InventoryPart>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Product mapping
            modelBuilder.Entity<Product>(e =>
            {
                e.ToTable("products");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasColumnName("id");
                e.Property(x => x.Code).HasMaxLength(64).IsRequired();
                e.HasIndex(x => x.Code).IsUnique();
                e.Property(x => x.Name).HasMaxLength(256).IsRequired();
                e.Property(x => x.Price).HasColumnType("numeric(18,2)");
            });

            // User mapping
            modelBuilder.Entity<User>(e =>
            {
                e.ToTable("users");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasColumnName("id");
                e.Property(x => x.Username)
                    .HasColumnName("username")
                    .HasMaxLength(50)
                    .IsRequired();
                e.HasIndex(x => x.Username).IsUnique();
                e.Property(x => x.PasswordHash)
                    .HasColumnName("password_hash")
                    .IsRequired();
                e.Property(x => x.RoleId).HasColumnName("role_id");
                e.Property(x => x.Status).HasColumnName("status");
                
                e.HasOne(u => u.Role)
                    .WithMany()
                    .HasForeignKey(u => u.RoleId);
            });

            // Role mapping
            modelBuilder.Entity<Role>(e =>
            {
                e.ToTable("roles");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasColumnName("id");
                e.Property(x => x.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            });

            // Permission mapping
            modelBuilder.Entity<Permission>(e =>
            {
                e.ToTable("permissions");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasColumnName("id");
                e.Property(x => x.Module).HasColumnName("module").HasMaxLength(50);
                e.Property(x => x.Page).HasColumnName("page").HasMaxLength(50);
                e.Property(x => x.Action).HasColumnName("action").HasMaxLength(50);
            });

            // RolePermission mapping
            modelBuilder.Entity<RolePermission>(e =>
            {
                e.ToTable("role_permissions");
                e.HasKey(x => new { x.RoleId, x.PermissionId });
                e.Property(x => x.RoleId).HasColumnName("role_id");
                e.Property(x => x.PermissionId).HasColumnName("permission_id");
            });

            // Company mapping
            modelBuilder.Entity<Company>(e =>
            {
                e.ToTable("company_tab");
                e.HasKey(x => x.CompanyId);

                e.Property(x => x.CompanyId).HasColumnName("company").HasMaxLength(80).IsRequired();
                e.Property(x => x.Name).HasColumnName("name").HasMaxLength(400).IsRequired();
                e.Property(x => x.CreationDate)
                    .HasColumnName("creation_date")
                    .HasColumnType("date")
                    .IsRequired();
                e.Property(x => x.AssociationNo).HasColumnName("association_no").HasMaxLength(200);
                e.Property(x => x.DefaultLanguage).HasColumnName("default_language").HasMaxLength(8).IsRequired();
                e.Property(x => x.Logotype).HasColumnName("logotype").HasMaxLength(400);
                e.Property(x => x.CorporateForm).HasColumnName("corporate_form").HasMaxLength(32);
                e.Property(x => x.Country).HasColumnName("country").HasMaxLength(8).IsRequired();
                e.Property(x => x.CreatedBy).HasColumnName("created_by").HasMaxLength(120).IsRequired();
                e.Property(x => x.LocalizationCountry).HasColumnName("localization_country").HasMaxLength(80).IsRequired();
                e.Property(x => x.Rowversion).HasColumnName("rowversion").HasColumnType("numeric(22)").IsRequired();
                e.Property(x => x.Rowkey).HasColumnName("rowkey").HasMaxLength(200).IsRequired();
            });

            // CustomerInfo mapping
            modelBuilder.Entity<CustomerInfo>(e =>
            {
                e.ToTable("customer_info");
                e.HasKey(x => x.CustomerId);

                e.Property(x => x.CustomerId)
                    .HasColumnName("customer_id")
                    .HasMaxLength(80)
                    .IsRequired();
                    
                e.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(400)
                    .IsRequired();
                    
                e.Property(x => x.AssociationNo)
                    .HasColumnName("association_no")
                    .HasMaxLength(200);
                    
                e.Property(x => x.CorporateForm)
                    .HasColumnName("corporate_form")
                    .HasMaxLength(32);
                    
                e.Property(x => x.Country)
                    .HasColumnName("country")
                    .HasMaxLength(8)
                    .IsRequired()
                    .HasDefaultValue("TR");
                    
                e.Property(x => x.PartyType)
                    .HasColumnName("party_type")
                    .HasMaxLength(80);
                    
                e.Property(x => x.Category)
                    .HasColumnName("category")
                    .HasMaxLength(80);
                    
                e.Property(x => x.CheckLimit)
                    .HasColumnName("check_limit")
                    .HasMaxLength(20);
                    
                e.Property(x => x.LimitControlType)
                    .HasColumnName("limit_control_type")
                    .HasMaxLength(80);
                    
                e.Property(x => x.DefaultLanguage)
                    .HasColumnName("default_language")
                    .HasMaxLength(8)
                    .IsRequired()
                    .HasDefaultValue("tr");
                    
                e.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .HasMaxLength(80)
                    .IsRequired();
                    
                e.Property(x => x.ChangedBy)
                    .HasColumnName("changed_by")
                    .HasMaxLength(80);
                    
                e.Property(x => x.CreationDate)
                    .HasColumnName("creation_date")
                    .HasColumnType("date")
                    .IsRequired()
                    .HasConversion(
                        v => v.ToDateTime(TimeOnly.MinValue),
                        v => DateOnly.FromDateTime(v));
                    
                e.Property(x => x.IdentifierReference)
                    .HasColumnName("identifier_reference")
                    .HasMaxLength(400);
                    
                e.Property(x => x.Rowversion)
                    .HasColumnName("rowversion")
                    .HasColumnType("numeric(22,0)")
                    .IsRequired()
                    .HasDefaultValue(1);
                    
                e.Property(x => x.Rowkey)
                    .HasColumnName("rowkey")
                    .HasMaxLength(200)
                    .IsRequired();
                    
                e.Property(x => x.Rowtype)
                    .HasColumnName("rowtype")
                    .HasMaxLength(120);
            });

            // INVENTORY_PART mapping - SADELEŞTİRİLMİŞ
            modelBuilder.Entity<InventoryPart>(e =>
            {
                e.ToTable("inventory_part");
                e.HasKey(x => new { x.Contract, x.PartNo });

                // Anahtar alanlar
                e.Property(x => x.Contract)
                    .HasColumnName("contract")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.PartNo)
                    .HasColumnName("part_no")
                    .HasMaxLength(100)
                    .IsRequired();
                
                // Temel bilgiler
                e.Property(x => x.AccountingGroup)
                    .HasColumnName("accounting_group")
                    .HasMaxLength(20);
                    
                e.Property(x => x.CountryOfOrigin)
                    .HasColumnName("country_of_origin")
                    .HasMaxLength(12);
                    
                e.Property(x => x.EstimatedMaterialCost)
                    .HasColumnName("estimated_material_cost")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.PartProductCode)
                    .HasColumnName("part_product_code")
                    .HasMaxLength(20);
                    
                e.Property(x => x.PartProductFamily)
                    .HasColumnName("part_product_family")
                    .HasMaxLength(20);
                    
                e.Property(x => x.PartStatus)
                    .HasColumnName("part_status")
                    .HasMaxLength(4);
                    
                e.Property(x => x.PlannerBuyer)
                    .HasColumnName("planner_buyer")
                    .HasMaxLength(80);
                    
                e.Property(x => x.PrimeCommodity)
                    .HasColumnName("prime_commodity")
                    .HasMaxLength(20);
                    
                e.Property(x => x.SecondCommodity)
                    .HasColumnName("second_commodity")
                    .HasMaxLength(20);
                
                // Ölçü birimleri
                e.Property(x => x.UnitMeas)
                    .HasColumnName("unit_meas")
                    .HasMaxLength(40);
                    
                e.Property(x => x.SalesUnitMeas)
                    .HasColumnName("sales_unit_meas")
                    .HasMaxLength(40);
                
                // Açıklamalar
                e.Property(x => x.Description)
                    .HasColumnName("description")
                    .HasMaxLength(800);
                
                // Fiyat ve vergi
                e.Property(x => x.ListPrice)
                    .HasColumnName("list_price")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.ListPriceInclTax)
                    .HasColumnName("list_price_incl_tax")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.PriceConvFactor)
                    .HasColumnName("price_conv_factor")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.TaxCode)
                    .HasColumnName("tax_code")
                    .HasMaxLength(80);
                    
                e.Property(x => x.TaxClassId)
                    .HasColumnName("tax_class_id")
                    .HasMaxLength(80);
                    
                e.Property(x => x.SalesType)
                    .HasColumnName("sales_type")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.SalesTypeDb)
                    .HasColumnName("sales_type_db")
                    .HasMaxLength(80);
                
                // Depolama gereksinimleri
                e.Property(x => x.StorageWidthRequirement)
                    .HasColumnName("storage_width_requirement")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.StorageHeightRequirement)
                    .HasColumnName("storage_height_requirement")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.StorageDepthRequirement)
                    .HasColumnName("storage_depth_requirement")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.StorageVolumeRequirement)
                    .HasColumnName("storage_volume_requirement")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.StorageWeightRequirement)
                    .HasColumnName("storage_weight_requirement")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.MinStorageTemperature)
                    .HasColumnName("min_storage_temperature")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.MaxStorageTemperature)
                    .HasColumnName("max_storage_temperature")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.MinStorageHumidity)
                    .HasColumnName("min_storage_humidity")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.MaxStorageHumidity)
                    .HasColumnName("max_storage_humidity")
                    .HasColumnType("numeric(22,2)");
                
                // Paketleme
                e.Property(x => x.StandardPutawayQty)
                    .HasColumnName("standard_putaway_qty")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.StandardPackSize)
                    .HasColumnName("standard_pack_size")
                    .HasColumnType("numeric(22,2)");
                
                // Tarih ve süre
                e.Property(x => x.CreateDate)
                    .HasColumnName("create_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.ExpectedLeadtime)
                    .HasColumnName("expected_leadtime")
                    .HasColumnType("numeric(22,0)");
                
                // Sistem alanları
                e.Property(x => x.Rowversion)
                    .HasColumnName("rowversion")
                    .HasColumnType("numeric(22,0)")
                    .IsRequired()
                    .HasDefaultValue(1);
                    
                e.Property(x => x.Rowkey)
                    .HasColumnName("rowkey")
                    .HasMaxLength(200)
                    .IsRequired();
            });
        }
    }
}