using System.ComponentModel.DataAnnotations;

namespace ShopApi.DTOs;

public record UpdateQuantityRequest
{
    [Range(0, int.MaxValue, ErrorMessage = "จำนวนต้องไม่ติดลบ")]
    public int Quantity { get; init; }
}
