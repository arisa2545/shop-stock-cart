using ShopApi.Models;

namespace ShopApi.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetActiveWithStockAsync(CancellationToken ct = default);

    Task<Product?> GetByIdWithStockAsync(int id, CancellationToken ct = default);
}
