using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Models;

namespace ShopApi.Repositories;

public class CartRepository(AppDbContext db) : ICartRepository
{
    public void Add(Cart cart) => db.Carts.Add(cart);

    public Task<Cart?> GetCartWithItemsAsync(Guid cartId, CancellationToken ct = default) =>
        db.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Stock)
            .FirstOrDefaultAsync(c => c.Id == cartId, ct);

    public Task<bool> ExistsAsync(Guid cartId, CancellationToken ct = default) =>
        db.Carts.AnyAsync(c => c.Id == cartId, ct);
}
