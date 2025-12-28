using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

public class PermissionService
{
    private readonly IConfiguration _config;

    public PermissionService(IConfiguration config)
    {
        _config = config;
    }

    public bool HasPermission(string role, string module, string page, string action)
    {
        var permissions = _config.GetSection("modules").Get<Dictionary<string, Module>>();
        if (!permissions.ContainsKey(module)) return false;

        var pages = permissions[module].Pages;
        if (!pages.ContainsKey(page)) return false;

        return pages[page].Actions.Contains(action) && RoleHasAccess(role, module, page, action);
    }

    private bool RoleHasAccess(string role, string module, string page, string action)
    {
        // Burada DB'den role-permission eşleşmesi kontrol edilir
        // Örn: IK rolü payroll tablosuna erişebilir, admin erişemez
        return true;
    }
}

public class Module
{
    public string Label { get; set; }
    public Dictionary<string, Page> Pages { get; set; }
}

public class Page
{
    public string Label { get; set; }
    public List<string> Actions { get; set; }
}