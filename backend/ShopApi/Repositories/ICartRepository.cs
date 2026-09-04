using ShopApi.Models;

namespace ShopApi.Repositories;

public interface ICartRepository
{
    void Add(Cart cart);

    Task<Cart?> GetCartWithItemsAsync(Guid cartId, CancellationToken ct = default);

    Task<bool> ExistsAsync(Guid cartId, CancellationToken ct = default);
}
