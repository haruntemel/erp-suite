using System.ComponentModel.DataAnnotations.Schema;

namespace Erp.Api.Models
{
   [Table("roles")]
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
}