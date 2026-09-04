namespace ShopApi.Common;

/// <summary>
/// business error ไม่ใช่ bug ของระบบ เช่น สต๊อกไม่พอ / ตะกร้าว่าง
/// ExceptionMiddleware จะแปลงเป็น HTTP 400 พร้อม code ให้ FE เอาไปแยกเคสได้
/// </summary>
public class BusinessException(string code, string message, object? details = null)
    : Exception(message)
{
    public string Code { get; } = code;

    public object? Details { get; } = details;

    public virtual int StatusCode => StatusCodes.Status400BadRequest;
}

public class NotFoundException(string code, string message)
    : BusinessException(code, message)
{
    public override int StatusCode => StatusCodes.Status404NotFound;
}
