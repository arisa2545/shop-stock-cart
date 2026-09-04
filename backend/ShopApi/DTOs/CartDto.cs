namespace ShopApi.DTOs;

public record CartDto(
    Guid CartId,
    IReadOnlyList<CartItemDto> Items,
    int TotalItems,
    decimal TotalAmount);

public record CartItemDto(
    int Id,
    int ProductId,
    string Code,
    string Name,
    string? ImageUrl,
    string Unit,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal,
    int StockQuantity,
    bool CanIncrease);

public record CreateCartResponse(Guid CartId);
