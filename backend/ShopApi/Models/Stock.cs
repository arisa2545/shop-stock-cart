namespace ShopApi.Models;

/// <summary>
/// สต๊อกคงเหลือ แยกตารางจาก Products
/// </summary>
public class Stock
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }

    public Product Product { get; set; } = null!;
}
