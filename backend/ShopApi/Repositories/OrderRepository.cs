using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Models;

namespace ShopApi.Repositories;

public class OrderRepository(AppDbContext db) : IOrderRepository
{
    public void Add(Order order) => db.Orders.Add(order);

    public Task<int> CountByOrderNoPrefixAsync(string prefix, CancellationToken ct = default) =>
        db.Orders.CountAsync(o => o.OrderNo.StartsWith(prefix), ct);
}
