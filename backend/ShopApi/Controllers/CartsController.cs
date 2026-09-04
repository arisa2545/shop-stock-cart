using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

    [HttpPut("{cartId:guid}/items/{productId:int}")]
    public async Task<ActionResult<CartDto>> UpdateQuantity(
        Guid cartId, int productId, [FromBody] UpdateQuantityRequest request, CancellationToken ct) =>
        Ok(await carts.UpdateQuantityAsync(cartId, productId, request, ct));

    [HttpDelete("{cartId:guid}/items/{productId:int}")]
    public async Task<ActionResult<CartDto>> RemoveItem(Guid cartId, int productId, CancellationToken ct) =>
        Ok(await carts.RemoveItemAsync(cartId, productId, ct));

    [HttpDelete("{cartId:guid}/items")]
    public async Task<ActionResult<CartDto>> Clear(Guid cartId, CancellationToken ct) =>
        Ok(await carts.ClearAsync(cartId, ct));

    [HttpPost("{cartId:guid}/checkout")]
    public async Task<ActionResult<CheckoutResultDto>> Checkout(
        Guid cartId,
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] CheckoutRequest? request,
        CancellationToken ct) =>
        Ok(await carts.CheckoutAsync(cartId, request, ct));
}
