using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Unicode;

namespace ShopApi.Common;

/// <summary>
/// จุดเดียวในระบบที่แปลง exception เป็น HTTP response
/// controller/service จึงไม่ต้องเขียน try-catch หรือ return BadRequest() เองเลย
/// </summary>
public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (BusinessException ex)
        {
            logger.LogInformation("Business rule rejected: {Code} — {Message}", ex.Code, ex.Message);
            await WriteAsync(context, ex.StatusCode, ex.Code, ex.Message, ex.Details);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception on {Method} {Path}",
                context.Request.Method, context.Request.Path);

            await WriteAsync(context, StatusCodes.Status500InternalServerError,
                "INTERNAL_ERROR", "เกิดข้อผิดพลาดภายในระบบ", null);
        }
    }

    private static async Task WriteAsync(
        HttpContext context, int statusCode, string code, string message, object? details)
    {
        if (context.Response.HasStarted)
            return;

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json; charset=utf-8";

        var payload = new JsonObject
        {
            ["code"] = code,
            ["message"] = message
        };

        if (details is not null)
        {
            var node = JsonSerializer.SerializeToNode(details, JsonOptions);

            if (node is JsonObject obj)
            {
                foreach (var key in obj.Select(x => x.Key).ToList())
                {
                    var value = obj[key];
                    obj.Remove(key);
                    payload[key] = value;
                }
            }
            else
            {
                payload["details"] = node;
            }
        }

        await context.Response.WriteAsync(payload.ToJsonString(JsonOptions));
    }
}
