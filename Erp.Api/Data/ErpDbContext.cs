using Microsoft.EntityFrameworkCore;
using Erp.Api.Models;

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
        }
    }
}