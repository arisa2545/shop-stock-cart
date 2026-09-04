namespace ShopApi.DTOs;

public record ProductDto(
    int Id,
    string Code,
    string Name,
    string? Description,
    decimal UnitPrice,
    string Unit,
    string? ImageUrl,
    int StockQuantity
);
