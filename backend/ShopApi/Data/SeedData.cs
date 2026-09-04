using Microsoft.EntityFrameworkCore;
using ShopApi.Models;

namespace ShopApi.Data;

/// <summary>
/// Mock data ใส่ผ่าน HasData → ฝังลงไปใน migration เลย
/// </summary>
public static class SeedData
{
    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static void Apply(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasData(
            NewProduct(1, "P001", "น้ำดื่ม 600ml", "น้ำดื่มสะอาด ขนาดพกพา", 7.00m, "ขวด"),
            NewProduct(2, "P002", "โค้ก กระป๋อง", "ซ่าเย็นชื่นใจ ขนาด 325ml", 15.00m, "กระป๋อง"),
            NewProduct(3, "P003", "ขนมปังโฮลวีท", "โฮลวีท 100% ไม่ใส่วัตถุกันเสีย", 45.00m, "แถว"),
            NewProduct(4, "P004", "นมสด 1L", "นมโคแท้ 100% พาสเจอร์ไรส์", 62.50m, "กล่อง"),
            NewProduct(5, "P005", "ไข่ไก่ เบอร์ 2 (แผง)", "ไข่สดใหม่ คัดขนาด แผงละ 30 ฟอง", 125.00m, "แผง"),
            NewProduct(6, "P006", "กาแฟ 3in1 (แพ็ค 27 ซอง)", "กาแฟปรุงสำเร็จ ชงง่าย", 89.00m, "แพ็ค"),
            NewProduct(7, "P007", "บะหมี่กึ่งสำเร็จรูป (แพ็ค 6)", "รสต้มยำกุ้ง แพ็ค 6 ซอง", 42.00m, "แพ็ค"),
            NewProduct(8, "P008", "น้ำมันพืช 1 ลิตร", "น้ำมันถั่วเหลือง ผ่านกรรมวิธี", 55.50m, "ขวด", hasImage: false),
            NewProduct(9, "P009", "ข้าวหอมมะลิ 5 กก.", "ข้าวใหม่ต้นฤดู หอมนุ่ม", 285.00m, "ถุง"),
            NewProduct(10, "P010", "ทิชชู่ม้วน (แพ็ค 12)", "ทิชชู่หนา 2 ชั้น ซับน้ำดี", 99.00m, "แพ็ค"),
            NewProduct(11, "P011", "ผงซักฟอก 900 กรัม", "ซักมือ ซักเครื่อง กลิ่นหอมติดทน", 79.00m, "ถุง", hasImage: false),
            NewProduct(12, "P012", "ยาสีฟัน 160 กรัม", "สูตรฟลูออไรด์ ลดกลิ่นปาก", 68.50m, "หลอด"),
            NewProduct(13, "P013", "น้ำปลาแท้ 700ml", "ปลาแท้หมักธรรมชาติ รสกลมกล่อม", 38.00m, "ขวด"),
            NewProduct(14, "P014", "ทูน่ากระป๋องในน้ำแร่", "เนื้อทูน่าแน่น โปรตีนสูง ไขมันต่ำ", 32.50m, "กระป๋อง"),
            NewProduct(15, "P015", "กระดาษชำระแบบกล่อง", "เนื้อนุ่ม 2 ชั้น 200 แผ่น", 45.00m, "กล่อง")
        );

        // จำนวนตั้งใจให้มีเคสทดสอบครบ — ดูคอมเมนต์ท้ายบรรทัด
        modelBuilder.Entity<Stock>().HasData(
            NewStock(1, productId: 1, quantity: 100),  // เคสปกติ
            NewStock(2, productId: 2, quantity: 50),   // เคสปกติ
            NewStock(3, productId: 3, quantity: 10),   // ทดสอบเพิ่มจนชนเพดาน
            NewStock(4, productId: 4, quantity: 3),    // ทดสอบ "เพิ่มไม่ได้แล้ว" ได้ไว
            NewStock(5, productId: 5, quantity: 1),    // ทดสอบเหลือชิ้นสุดท้าย
            NewStock(6, productId: 6, quantity: 0),    // ทดสอบสินค้าหมด → ปุ่มต้อง disable
            NewStock(7, productId: 7, quantity: 60),
            NewStock(8, productId: 8, quantity: 25),
            NewStock(9, productId: 9, quantity: 20),
            NewStock(10, productId: 10, quantity: 80),
            NewStock(11, productId: 11, quantity: 40),
            NewStock(12, productId: 12, quantity: 35),
            NewStock(13, productId: 13, quantity: 2),  // ทดสอบป้าย "เหลือน้อย"
            NewStock(14, productId: 14, quantity: 45),
            NewStock(15, productId: 15, quantity: 4)   // ทดสอบป้าย "เหลือน้อย" ที่ขอบ (< 5)
        );
    }

    /// <param name="hasImage">
    private static Product NewProduct(
        int id, string code, string name, string? description, decimal unitPrice, string unit,
        bool hasImage = true) => new()
    {
        Id = id,
        Code = code,
        Name = name,
        Description = description,
        UnitPrice = unitPrice,
        Unit = unit,
        ImageUrl = hasImage ? $"/products/{code}.jpg" : null,
        IsActive = true,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt
    };

    private static Stock NewStock(int id, int productId, int quantity) => new()
    {
        Id = id,
        ProductId = productId,
        Quantity = quantity,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt
    };
}
