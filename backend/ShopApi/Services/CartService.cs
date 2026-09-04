using ShopApi.Common;
using ShopApi.Data;
using ShopApi.DTOs;
using ShopApi.Models;
using ShopApi.Repositories;

namespace ShopApi.Services;

public class CartService(ICartRepository carts, IProductRepository products, AppDbContext db) : ICartService
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

    public async Task<CartDto> AddItemAsync(Guid cartId, AddToCartRequest request, CancellationToken ct = default)
    {
        var cart = await carts.GetCartWithItemsAsync(cartId, ct)
            ?? throw new NotFoundException("CART_NOT_FOUND", "ไม่พบตะกร้าสินค้า");

        var product = await products.GetByIdWithStockAsync(request.ProductId, ct)
            ?? throw new NotFoundException("PRODUCT_NOT_FOUND", $"ไม่พบสินค้ารหัส {request.ProductId}");

        if (!product.IsActive)
            throw new BusinessException("PRODUCT_UNAVAILABLE", $"สินค้า “{product.Name}” ไม่เปิดขายแล้ว");

        var availableStock = product.Stock?.Quantity ?? 0;
        var existing = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        var inCart = existing?.Quantity ?? 0;

        // เทียบ "ที่มีอยู่ในตะกร้าแล้ว + ที่จะเพิ่ม" กับสต๊อก
        if (inCart + request.Quantity > availableStock)
        {
            throw new BusinessException(
                "INSUFFICIENT_STOCK",
                $"สินค้า “{product.Name}” คงเหลือ {availableStock} {product.Unit} (ในตะกร้ามีแล้ว {inCart})",
                new { productId = product.Id, availableStock, inCart });
        }

        if (existing is not null)
        {
            existing.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Quantity = request.Quantity
            });

        }

        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return await GetAsync(cartId, ct);
    }

    public async Task<CartDto> UpdateQuantityAsync(Guid cartId, int productId, UpdateQuantityRequest request, CancellationToken ct = default)
    {
        var cart = await carts.GetCartWithItemsAsync(cartId, ct)
            ?? throw new NotFoundException("CART_NOT_FOUND", "ไม่พบตะกร้าสินค้า");

        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new NotFoundException("CART_ITEM_NOT_FOUND", "ไม่พบสินค้านี้ในตะกร้า");

        if (request.Quantity == 0)
        {
            db.CartItems.Remove(item);
        }
        else
        {
            var availableStock = item.Product.Stock?.Quantity ?? 0;

            if (request.Quantity > availableStock)
            {
                throw new BusinessException(
                    "INSUFFICIENT_STOCK",
                    $"สินค้า “{item.Product.Name}” คงเหลือ {availableStock} {item.Product.Unit}",
                    new { productId, availableStock, inCart = item.Quantity });
            }

            item.Quantity = request.Quantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return await GetAsync(cartId, ct);
    }

    public async Task<CartDto> RemoveItemAsync(Guid cartId, int productId, CancellationToken ct = default)
    {
        var cart = await carts.GetCartWithItemsAsync(cartId, ct)
            ?? throw new NotFoundException("CART_NOT_FOUND", "ไม่พบตะกร้าสินค้า");

        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new NotFoundException("CART_ITEM_NOT_FOUND", "ไม่พบสินค้านี้ในตะกร้า");

        db.CartItems.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);

        return await GetAsync(cartId, ct);
    }

    public async Task<CartDto> ClearAsync(Guid cartId, CancellationToken ct = default)
    {
        var cart = await carts.GetCartWithItemsAsync(cartId, ct)
            ?? throw new NotFoundException("CART_NOT_FOUND", "ไม่พบตะกร้าสินค้า");

        if (cart.Items.Count > 0)
        {
            db.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(ct);
        }

        return await GetAsync(cartId, ct);
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
