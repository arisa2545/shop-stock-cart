using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.EntityFrameworkCore;
using ShopApi.Common;
using ShopApi.Data;
using ShopApi.Repositories;
using ShopApi.Services;

const string FrontendCors = "frontend";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()

    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();

builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCors, policy => policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Swagger UI ชี้ไปที่เอกสารที่ MapOpenApi() สร้าง — เปิดที่ http://localhost:5223/swagger
    app.UseSwaggerUI(o =>
    {
        o.SwaggerEndpoint("/openapi/v1.json", "ShopApi v1");
        o.RoutePrefix = "swagger";
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseCors(FrontendCors);

app.UseAuthorization();

app.MapControllers();

app.Run();
