using Microsoft.AspNetCore.Mvc;
using ShopApi.DTOs;
using ShopApi.Services;

namespace ShopApi.Controllers;

[ApiController]
[Route("api/carts")]
public class CartsController(ICartService carts) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CreateCartResponse>> Create(CancellationToken ct)
    {
        var cartId = await carts.CreateAsync(ct);

        return CreatedAtAction(nameof(GetById), new { cartId }, new CreateCartResponse(cartId));
    }

    [HttpGet("{cartId:guid}")]
    public async Task<ActionResult<CartDto>> GetById(Guid cartId, CancellationToken ct) =>
        Ok(await carts.GetAsync(cartId, ct));

    [HttpPost("{cartId:guid}/items")]
    public async Task<ActionResult<CartDto>> AddItem(
        Guid cartId, [FromBody] AddToCartRequest request, CancellationToken ct) =>
        Ok(await carts.AddItemAsync(cartId, request, ct));
}
