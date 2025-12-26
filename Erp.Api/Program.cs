using Erp.Api.Data;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;

var builder = WebApplication.CreateBuilder(args);

// EF Core PostgreSQL
builder.Services.AddDbContext<ErpDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// CORS (React dev server için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", p =>
        p.WithOrigins("http://localhost:5173", "http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// OData EDM Model
var edmBuilder = new ODataConventionModelBuilder();
edmBuilder.EntitySet<Erp.Api.Models.Product>("Products");

builder.Services.AddControllers()
    .AddOData(opt =>
        opt.AddRouteComponents("odata", edmBuilder.GetEdmModel())
           .Select().Filter().OrderBy().Expand().SetMaxTop(100).Count());

var app = builder.Build();

app.UseCors("FrontendDev");
app.MapControllers();

app.Run();