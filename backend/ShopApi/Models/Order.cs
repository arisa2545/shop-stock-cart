namespace ShopApi.Models;

public class Order
{
    public int Id { get; set; }

    public string OrderNo { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public int TotalItems { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
