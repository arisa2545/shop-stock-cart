using Microsoft.AspNetCore.Mvc;
using ShopApi.DTOs;
using ShopApi.Services;

namespace ShopApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IProductService products) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetAll(CancellationToken ct) =>
        Ok(await products.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetById(int id, CancellationToken ct) =>
        Ok(await products.GetByIdAsync(id, ct));
}
