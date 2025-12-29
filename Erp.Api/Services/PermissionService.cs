using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

public class PermissionService
{
    private readonly IConfiguration _config;

    public PermissionService(IConfiguration config)
    {
        _config = config;
    }

    public bool HasPermission(string role, string module, string page, string action)
    {
        // Admin her şeye erişebilir
        if (role == "admin") return true;

        var permissions = _config.GetSection("modules").Get<Dictionary<string, Module>>();
        if (permissions == null || !permissions.ContainsKey(module))
            return false;

        var pages = permissions[module].Pages;
        if (pages == null || !pages.ContainsKey(page))
            return false;

        var actions = pages[page].Actions;
        if (actions == null)
            return false;

        return actions.Contains(action) && RoleHasAccess(role, module, page, action);
    }

    private bool RoleHasAccess(string role, string module, string page, string action)
    {
        // Burada DB'den role-permission eşleşmesi kontrol edilir
        // Örn: IK rolü payroll tablosuna erişebilir
        return true;
    }
}

public class Module
{
    public string Label { get; set; } = string.Empty;
    public Dictionary<string, Page> Pages { get; set; } = new Dictionary<string, Page>();
}

public class Page
{
    public string Label { get; set; } = string.Empty;
    public List<string> Actions { get; set; } = new List<string>();
}