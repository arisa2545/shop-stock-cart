using ShopApi.Common;
using ShopApi.DTOs;
using ShopApi.Models;
using ShopApi.Repositories;

namespace ShopApi.Services;

public class ProductService(IProductRepository products) : IProductService
{
    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken ct = default)
    {
        var entities = await products.GetActiveWithStockAsync(ct);
        return entities.Select(ToDto).ToList();
    }

    public async Task<ProductDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await products.GetByIdWithStockAsync(id, ct)
            ?? throw new NotFoundException("PRODUCT_NOT_FOUND", $"ไม่พบสินค้ารหัส {id}");

        return ToDto(product);
    }

    private static ProductDto ToDto(Product p) => new(
        p.Id,
        p.Code,
        p.Name,
        p.Description,
        p.UnitPrice,
        p.Unit,
        p.ImageUrl,
        p.Stock?.Quantity ?? 0);
}
