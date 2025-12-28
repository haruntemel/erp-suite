using System.ComponentModel.DataAnnotations.Schema;

namespace Erp.Api.Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        public string Username { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("role_id")]
        public int? RoleId { get; set; }   // DB’de nullable

        [Column("status")]
        public bool? Status { get; set; }  // DB’de nullable
[ForeignKey("RoleId")]
public Role? Role { get; set; }
        // Navigation property ancak Role.cs varsa kullanılmalı
        // Eğer Role entity yoksa bu satırı kaldır
        // public Role? Role { get; set; }
    }
}