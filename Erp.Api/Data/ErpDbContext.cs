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

            // CustomerInfo mapping - DÜZELTİLMİŞ
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
                    
                // DateOnly için value converter EKLEYİN
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
                    
                // ROWVERSION için DOĞRU MAPPING - DECIMAL olarak
                e.Property(x => x.Rowversion)
                    .HasColumnName("rowversion")
                    .HasColumnType("numeric(22,0)")  // numeric(22,0) olarak
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
        }
    }
}