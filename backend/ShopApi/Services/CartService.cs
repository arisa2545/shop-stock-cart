using ShopApi.Common;
using ShopApi.Data;
using ShopApi.DTOs;
using ShopApi.Models;
using ShopApi.Repositories;

namespace ShopApi.Services;

public class CartService(ICartRepository carts, AppDbContext db) : ICartService
{
    public async Task<Guid> CreateAsync(CancellationToken ct = default)
    {
        var cart = new Cart { Id = Guid.NewGuid() };

        carts.Add(cart);
        await db.SaveChangesAsync(ct);

        return cart.Id;
    }

    public async Task<CartDto> GetAsync(Guid cartId, CancellationToken ct = default)
    {
        var cart = await carts.GetCartWithItemsAsync(cartId, ct) ?? throw new NotFoundException("CART_NOT_FOUND", "ไม่พบตะกร้าสินค้า");
        return ToResponse(cart);
    }

    private static CartDto ToResponse(Cart cart)
    {
        var items = cart.Items
            .OrderBy(i => i.Id)
            .Select(ToItemResponse)
            .ToList();

        return new CartDto(
            cart.Id,
            items,
            TotalItems: items.Sum(i => i.Quantity),
            TotalAmount: items.Sum(i => i.LineTotal));
    }

    private static CartItemDto ToItemResponse(CartItem item)
    {
        var product = item.Product;
        var stockQuantity = product.Stock?.Quantity ?? 0;

        return new CartItemDto(
            item.Id,
            product.Id,
            product.Code,
            product.Name,
            product.ImageUrl,
            product.Unit,
            product.UnitPrice,
            item.Quantity,
            LineTotal: product.UnitPrice * item.Quantity,
            stockQuantity,
            CanIncrease: item.Quantity < stockQuantity);
    }
}
