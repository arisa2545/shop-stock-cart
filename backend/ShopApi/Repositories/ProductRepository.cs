using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Models;

namespace ShopApi.Repositories;

public class ProductRepository(AppDbContext db) : IProductRepository
{
    public Task<List<Product>> GetActiveWithStockAsync(CancellationToken ct = default) =>
        db.Products
            .AsNoTracking()
            .Include(p => p.Stock)
            .Where(p => p.IsActive)
            .OrderBy(p => p.Code)
            .ToListAsync(ct);

    public Task<Product?> GetByIdWithStockAsync(int id, CancellationToken ct = default) =>
        db.Products
            .AsNoTracking()
            .Include(p => p.Stock)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
}
