using System.ComponentModel.DataAnnotations;

namespace ShopApi.DTOs;

public record AddToCartRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "ต้องระบุรหัสสินค้า")]
    public int ProductId { get; init; }

    [Range(1, int.MaxValue, ErrorMessage = "จำนวนต้องมากกว่า 0")]
    public int Quantity { get; init; }
}
