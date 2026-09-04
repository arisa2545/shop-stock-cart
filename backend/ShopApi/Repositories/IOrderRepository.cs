using ShopApi.Models;

namespace ShopApi.Repositories;

public interface IOrderRepository
{
    void Add(Order order);
    
    Task<int> CountByOrderNoPrefixAsync(string prefix, CancellationToken ct = default);
}
