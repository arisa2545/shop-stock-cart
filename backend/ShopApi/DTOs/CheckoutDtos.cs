namespace ShopApi.DTOs;

public record CheckoutRequest
{
    /// <summary>
    /// รายการที่จะจ่าย — ว่างหรือไม่ส่งมา = จ่ายทั้งตะกร้า)
    /// </summary>
    public List<int>? CartItemIds { get; init; }
}

public record CheckoutResultDto(
    int OrderId,
    string OrderNo,
    DateTime CreatedAt,
    int TotalItems,
    decimal TotalAmount,
    IReadOnlyList<CheckoutItemDto> Items);

public record CheckoutItemDto(
    int ProductId,
    string ProductCode,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal);
