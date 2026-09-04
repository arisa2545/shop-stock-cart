using ShopApi.DTOs;

namespace ShopApi.Services;

public interface ICartService
{
    Task<Guid> CreateAsync(CancellationToken ct = default);

    Task<CartDto> GetAsync(Guid cartId, CancellationToken ct = default);
}
