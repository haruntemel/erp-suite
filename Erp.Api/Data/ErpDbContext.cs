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
        public DbSet<CustomerOrder> CustomerOrders => Set<CustomerOrder>();
        public DbSet<CustomerOrderLine> CustomerOrderLines => Set<CustomerOrderLine>();
// Yeni eklenen DbSets - Ürün Ağacı
        public DbSet<ProdStructureTab> ProdStructureTabs => Set<ProdStructureTab>();
        public DbSet<ProdStructureHeadTab> ProdStructureHeadTabs => Set<ProdStructureHeadTab>();
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

            // INVENTORY_PART mapping
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

                    e.Property(x => x.TypeCode)
                    .HasColumnName("type_code")
                    .HasMaxLength(50);
                 e.Property(x => x.TypeCodeDb)
                    .HasColumnName("type_code_db")
                    .HasMaxLength(50);
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

            // CustomerOrder mapping
            modelBuilder.Entity<CustomerOrder>(e =>
            {
                e.ToTable("customer_order_tab");
                e.HasKey(x => new { x.Company, x.OrderNo, x.Contract });

                // Anahtar alanlar
                e.Property(x => x.Company)
                    .HasColumnName("company")
                    .HasMaxLength(80)
                    .IsRequired();
                    
                e.Property(x => x.OrderNo)
                    .HasColumnName("order_no")
                    .HasMaxLength(48)
                    .IsRequired();
                    
                e.Property(x => x.Contract)
                    .HasColumnName("contract")
                    .HasMaxLength(20)
                    .IsRequired();

                // Müşteri bilgileri
                e.Property(x => x.CustomerNo)
                    .HasColumnName("customer_no")
                    .HasMaxLength(80)
                    .IsRequired();
                    
                e.Property(x => x.CustomerPoNo)
                    .HasColumnName("customer_po_no")
                    .HasMaxLength(200);

                // Tarih bilgileri
                e.Property(x => x.DateEntered)
                    .HasColumnName("date_entered")
                    .HasColumnType("date")
                    .IsRequired()
                    .HasConversion(
                        v => v.ToDateTime(TimeOnly.MinValue),
                        v => DateOnly.FromDateTime(v));
                    
                e.Property(x => x.WantedDeliveryDate)
                    .HasColumnName("wanted_delivery_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.PayTermBaseDate)
                    .HasColumnName("pay_term_base_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);

                // Ödeme ve teslimat
                e.Property(x => x.CurrencyCode)
                    .HasColumnName("currency_code")
                    .HasMaxLength(12);
                    
                e.Property(x => x.PayTermId)
                    .HasColumnName("pay_term_id")
                    .HasMaxLength(80);
                    
                e.Property(x => x.DeliveryTerms)
                    .HasColumnName("delivery_terms")
                    .HasMaxLength(20);
                    
                e.Property(x => x.ShipViaCode)
                    .HasColumnName("ship_via_code")
                    .HasMaxLength(12);
                    
                e.Property(x => x.DeliveryCountryCode)
                    .HasColumnName("delivery_country_code")
                    .HasMaxLength(4000);

                // Diğer bilgiler
                e.Property(x => x.OrderId)
                    .HasColumnName("order_id")
                    .HasMaxLength(12);
                    
                e.Property(x => x.AuthorizeCode)
                    .HasColumnName("authorize_code")
                    .HasMaxLength(80);
                    
                e.Property(x => x.SalesmanCode)
                    .HasColumnName("salesman_code")
                    .HasMaxLength(80);
                    
                e.Property(x => x.BillAddrNo)
                    .HasColumnName("bill_addr_no")
                    .HasMaxLength(200);
                    
                e.Property(x => x.ShipAddrNo)
                    .HasColumnName("ship_addr_no")
                    .HasMaxLength(200);
                    
                e.Property(x => x.InternalPoNo)
                    .HasColumnName("internal_po_no")
                    .HasMaxLength(48);
                    
                e.Property(x => x.NoteText)
                    .HasColumnName("note_text")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.Rowstate) // Objstate yerine Rowstate
        .HasColumnName("rowstate") // DB'de hala objstate olarak kalacak
        .HasMaxLength(4000);

                // Sistem alanları
                e.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .HasMaxLength(80)
                    .IsRequired();
                    
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

            // CustomerOrderLine mapping
            modelBuilder.Entity<CustomerOrderLine>(e =>
            {
                e.ToTable("customer_order_line_tab");
                e.HasKey(x => new { x.Company, x.OrderNo, x.Contract, x.LineNo, x.RelNo });

                // Anahtar alanlar
                e.Property(x => x.Company)
                    .HasColumnName("company")
                    .HasMaxLength(80)
                    .IsRequired();
                    
                e.Property(x => x.OrderNo)
                    .HasColumnName("order_no")
                    .HasMaxLength(48)
                    .IsRequired();
                    
                e.Property(x => x.Contract)
                    .HasColumnName("contract")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.LineNo)
                    .HasColumnName("line_no")
                    .HasMaxLength(16)
                    .IsRequired();
                    
                e.Property(x => x.RelNo)
                    .HasColumnName("rel_no")
                    .HasMaxLength(16)
                    .IsRequired();

                // Malzeme bilgileri
                e.Property(x => x.CatalogNo)
                    .HasColumnName("catalog_no")
                    .HasMaxLength(100)
                    .IsRequired();
                    
                e.Property(x => x.PartNo)
                    .HasColumnName("part_no")
                    .HasMaxLength(100)
                    .IsRequired();
                    
                e.Property(x => x.CustomerPartNo)
                    .HasColumnName("customer_part_no")
                    .HasMaxLength(180);
                    
                e.Property(x => x.CatalogDesc)
                    .HasColumnName("catalog_desc")
                    .HasMaxLength(800);
                    
                e.Property(x => x.CatalogType)
                    .HasColumnName("catalog_type")
                    .HasMaxLength(4000);

                // Miktar ve fiyat
                e.Property(x => x.BuyQtyDue)
                    .HasColumnName("buy_qty_due")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.CustomerPartBuyQty)
                    .HasColumnName("customer_part_buy_qty")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.BaseSaleUnitPrice)
                    .HasColumnName("base_sale_unit_price")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.BaseUnitPriceInclTax)
                    .HasColumnName("base_unit_price_incl_tax")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.SaleUnitPrice)
                    .HasColumnName("sale_unit_price")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.UnitPriceInclTax)
                    .HasColumnName("unit_price_incl_tax")
                    .HasColumnType("numeric(22,2)");

                // Ölçü birimleri
                e.Property(x => x.SalesUnitMeas)
                    .HasColumnName("sales_unit_meas")
                    .HasMaxLength(40);
                    
                e.Property(x => x.PriceUnitMeas)
                    .HasColumnName("price_unit_meas")
                    .HasMaxLength(40);
                    
                e.Property(x => x.CustomerPartUnitMeas)
                    .HasColumnName("customer_part_unit_meas")
                    .HasMaxLength(40);

                // Döviz ve indirim
                e.Property(x => x.CurrencyRate)
                    .HasColumnName("currency_rate")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.Discount)
                    .HasColumnName("discount")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.AdditionalDiscount)
                    .HasColumnName("additional_discount")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.PriceConvFactor)
                    .HasColumnName("price_conv_factor")
                    .HasColumnType("numeric(22,2)");
                    
                e.Property(x => x.CustomerPartConvFactor)
                    .HasColumnName("customer_part_conv_factor")
                    .HasColumnType("numeric(22,2)");

                // Tarih bilgileri
                e.Property(x => x.DateEntered)
                    .HasColumnName("date_entered")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.PlannedDeliveryDate)
                    .HasColumnName("planned_delivery_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.PlannedDueDate)
                    .HasColumnName("planned_due_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.PromisedDeliveryDate)
                    .HasColumnName("promised_delivery_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.RealShipDate)
                    .HasColumnName("real_ship_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.WantedDeliveryDate)
                    .HasColumnName("wanted_delivery_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.PlannedShipDate)
                    .HasColumnName("planned_ship_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.FirstActualShipDate)
                    .HasColumnName("first_actual_ship_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);
                    
                e.Property(x => x.TargetDate)
                    .HasColumnName("target_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                        v => v.HasValue ? DateOnly.FromDateTime(v.Value) : (DateOnly?)null);

                // Diğer bilgiler
                e.Property(x => x.LineItemNo)
                    .HasColumnName("line_item_no")
                    .HasColumnType("numeric(22,0)");
                    
                e.Property(x => x.OrderCode)
                    .HasColumnName("order_code")
                    .HasMaxLength(12);
                    
                e.Property(x => x.DeliveryType)
                    .HasColumnName("delivery_type")
                    .HasMaxLength(80);
                    
                e.Property(x => x.TaxCode)
                    .HasColumnName("tax_code")
                    .HasMaxLength(80);
                    
                e.Property(x => x.NoteText)
                    .HasColumnName("note_text")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.CustomerNo)
                    .HasColumnName("customer_no")
                    .HasMaxLength(80);
                    
                e.Property(x => x.ForwardAgentId)
                    .HasColumnName("forward_agent_id")
                    .HasMaxLength(80);
                    
                e.Property(x => x.ShipViaCode)
                    .HasColumnName("ship_via_code")
                    .HasMaxLength(12);
                    
                e.Property(x => x.DeliveryTerms)
                    .HasColumnName("delivery_terms")
                    .HasMaxLength(20);
                    
                e.Property(x => x.PartOwnership)
                    .HasColumnName("part_ownership")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.ActivitySeq)
                    .HasColumnName("activity_seq")
                    .HasColumnType("numeric(22,0)");
                    
                e.Property(x => x.ProjectId)
                    .HasColumnName("project_id")
                    .HasMaxLength(40);
                    
                e.Property(x => x.CustomerPoLineNo)
                    .HasColumnName("customer_po_line_no")
                    .HasMaxLength(16);
                    
                e.Property(x => x.FreeOfCharge)
                    .HasColumnName("free_of_charge")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.Rowstate) // State yerine Rowstate
        .HasColumnName("rowstate") // DB'de hala state olarak kalacak
        .HasMaxLength(4000);

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
             // ProdStructureHeadTab mapping
            modelBuilder.Entity<ProdStructureHeadTab>(e =>
            {
                e.ToTable("prod_structure_head_tab"); // Tablo adını uygun şekilde ayarlayın
                e.HasKey(x => new { x.Contract, x.PartNo, x.EngChgLevel, x.BomTypeDb });

                // Anahtar alanlar
                e.Property(x => x.Contract)
                    .HasColumnName("contract")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.PartNo)
                    .HasColumnName("part_no")
                    .HasMaxLength(100)
                    .IsRequired();
                    
                e.Property(x => x.EngChgLevel)
                    .HasColumnName("eng_chg_level")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.BomTypeDb)
                    .HasColumnName("bom_type_db")
                    .HasMaxLength(20)
                    .IsRequired();

                // Diğer alanlar
                e.Property(x => x.NoteText)
                    .HasColumnName("note_text")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.EffPhaseInDate)
                    .HasColumnName("eff_phase_in_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value : (DateTime?)null,
                        v => v);
                    
                e.Property(x => x.EffPhaseOutDate)
                    .HasColumnName("eff_phase_out_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value : (DateTime?)null,
                        v => v);
                    
                e.Property(x => x.CreateDate)
                    .HasColumnName("create_date")
                    .HasColumnType("date")
                    .IsRequired()
                    .HasConversion(
                        v => v,
                        v => v);
                    
                e.Property(x => x.Rowstate)
                    .HasColumnName("rowstate")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .HasMaxLength(80)
                    .IsRequired();
                    
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

            // ProdStructureTab mapping
            modelBuilder.Entity<ProdStructureTab>(e =>
            {
                e.ToTable("prod_structure_tab"); // Tablo adını uygun şekilde ayarlayın
                e.HasKey(x => new { 
                    x.Contract, 
                    x.PartNo, 
                    x.EngChgLevel, 
                    x.BomTypeDb, 
                    x.AlternativeNo, 
                    x.LineItemNo, 
                    x.LineSequence, 
                    x.OperationNo 
                });

                // Anahtar alanlar
                e.Property(x => x.Contract)
                    .HasColumnName("contract")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.PartNo)
                    .HasColumnName("part_no")
                    .HasMaxLength(100)
                    .IsRequired();
                    
                e.Property(x => x.EngChgLevel)
                    .HasColumnName("eng_chg_level")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.BomTypeDb)
                    .HasColumnName("bom_type_db")
                    .HasMaxLength(20)
                    .IsRequired();
                    
                e.Property(x => x.AlternativeNo)
                    .HasColumnName("alternative_no")
                    .HasMaxLength(20)
                    .IsRequired();

                // Sayısal alanlar
                e.Property(x => x.LineItemNo)
                    .HasColumnName("line_item_no")
                    .HasColumnType("numeric(22,0)")
                    .IsRequired();
                    
                e.Property(x => x.LineSequence)
                    .HasColumnName("line_sequence")
                    .HasColumnType("numeric(22,0)")
                    .IsRequired();
                    
                e.Property(x => x.OperationNo)
                    .HasColumnName("operation_no")
                    .HasColumnType("numeric(22,0)")
                    .IsRequired();

                // Diğer alanlar
                e.Property(x => x.NoteText)
                    .HasColumnName("note_text")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.Source)
                    .HasColumnName("source")
                    .HasMaxLength(80);
                    
                e.Property(x => x.CreateDate)
                    .HasColumnName("create_date")
                    .HasColumnType("date")
                    .IsRequired()
                    .HasConversion(
                        v => v,
                        v => v);
                    
                e.Property(x => x.LastActivityDate)
                    .HasColumnName("last_activity_date")
                    .HasColumnType("date")
                    .HasConversion(
                        v => v.HasValue ? v.Value : (DateTime?)null,
                        v => v);
                    
                e.Property(x => x.ComponentPart)
                    .HasColumnName("component_part")
                    .HasMaxLength(100);
                    
                e.Property(x => x.Rowstate)
                    .HasColumnName("rowstate")
                    .HasMaxLength(4000);
                    
                e.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .HasMaxLength(80)
                    .IsRequired();
                    
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