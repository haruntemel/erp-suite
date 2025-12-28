
namespace Erp.Api.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public string Module { get; set; } = "";
        public string Page { get; set; } = "";
        public string Action { get; set; } = "";
    }
}