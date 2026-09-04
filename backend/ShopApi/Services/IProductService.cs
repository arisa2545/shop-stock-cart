using ShopApi.DTOs;

namespace ShopApi.Services;

public interface IProductService
{
    Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken ct = default);

    Task<ProductDto> GetByIdAsync(int id, CancellationToken ct = default);
}
