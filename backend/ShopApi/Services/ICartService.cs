using ShopApi.DTOs;

namespace ShopApi.Services;

public interface ICartService
{
    Task<Guid> CreateAsync(CancellationToken ct = default);

    Task<CartDto> GetAsync(Guid cartId, CancellationToken ct = default);

    Task<CartDto> AddItemAsync(Guid cartId, AddToCartRequest request, CancellationToken ct = default);

    Task<CartDto> UpdateQuantityAsync(Guid cartId, int productId, UpdateQuantityRequest request, CancellationToken ct = default);

    Task<CartDto> RemoveItemAsync(Guid cartId, int productId, CancellationToken ct = default);

    Task<CartDto> ClearAsync(Guid cartId, CancellationToken ct = default);
}
