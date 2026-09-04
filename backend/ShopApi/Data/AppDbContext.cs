using Microsoft.EntityFrameworkCore;
using ShopApi.Models;

namespace ShopApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    private const string CreatedAt = nameof(Product.CreatedAt);

    private const string UpdatedAt = nameof(Product.UpdatedAt);

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.HasKey(x => x.Id);

            e.Property(x => x.Code).IsRequired().HasMaxLength(20);
            e.HasIndex(x => x.Code).IsUnique();

            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.Unit).IsRequired().HasMaxLength(20).HasDefaultValue("ชิ้น");
            e.Property(x => x.ImageUrl).HasMaxLength(500);
            e.Property(x => x.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Stock>(e =>
        {
            // ด่านสุดท้ายกันสต๊อกติดลบ เผื่อ logic ฝั่ง service พลาด
            e.ToTable("Stocks", t =>
                t.HasCheckConstraint("CK_Stocks_Quantity_NonNegative", "\"Quantity\" >= 0"));
            e.HasKey(x => x.Id);

            // UNIQUE บังคับความสัมพันธ์ 1:1 — สินค้า 1 ตัวมีแถวสต๊อกได้แถวเดียว
            e.HasIndex(x => x.ProductId).IsUnique();

            e.HasOne(x => x.Product)
                .WithOne(x => x.Stock)
                .HasForeignKey<Stock>(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Cart>(e =>
        {
            e.ToTable("Carts");
            e.HasKey(x => x.Id);
        });

        modelBuilder.Entity<CartItem>(e =>
        {
            // จำนวน 0 ให้ลบแถวทิ้ง ไม่เก็บไว้
            e.ToTable("CartItems", t =>
                t.HasCheckConstraint("CK_CartItems_Quantity_Positive", "\"Quantity\" > 0"));
            e.HasKey(x => x.Id);

            // สินค้าเดิมในตะกร้าเดียวกันต้องเป็นแถวเดิม แล้วบวก Quantity ไม่ใช่ insert แถวใหม่
            // index นี้ขึ้นต้นด้วย CartId อยู่แล้ว จึงใช้ query "ดึงตะกร้าทั้งใบ" ได้ด้วย
            // ไม่ต้องสร้าง index CartId ซ้ำอีกตัว
            e.HasIndex(x => new { x.CartId, x.ProductId }).IsUnique();

            e.HasOne(x => x.Cart)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // ลบสินค้าไม่ควรทำให้รายการในตะกร้าหายเงียบๆ → Restrict
            e.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.ToTable("Orders");
            e.HasKey(x => x.Id);

            e.Property(x => x.OrderNo).IsRequired().HasMaxLength(30);
            e.HasIndex(x => x.OrderNo).IsUnique();

            e.Property(x => x.TotalAmount).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.ToTable("OrderItems");
            e.HasKey(x => x.Id);

            e.Property(x => x.ProductCode).IsRequired().HasMaxLength(20);
            e.Property(x => x.ProductName).IsRequired().HasMaxLength(200);
            e.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.LineTotal).HasColumnType("decimal(18,2)");

            e.HasOne(x => x.Order)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        SeedData.Apply(modelBuilder);
    }

    // override เวอร์ชันที่รับ bool ทั้งสองตัว เพราะ SaveChanges() / SaveChangesAsync(ct)
    // เรียกต่อมาที่ตัวนี้ — ครอบคลุมทุกทางเข้าด้วยการเขียนแค่ 2 เมธอด
    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ApplyTimestamps();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        ApplyTimestamps();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    /// <summary>
    /// เซ็ต CreatedAt / UpdatedAt ให้อัตโนมัติทุกครั้งที่บันทึก จะได้ไม่มีทางลืมเซ็ตเอง
    /// Orders / OrderItems ไม่มีคอลัมน์ UpdatedAt → FindProperty คืน null → ถูกข้ามไปเอง
    /// </summary>
    private void ApplyTimestamps()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State is not (EntityState.Added or EntityState.Modified))
                continue;

            if (entry.State == EntityState.Added && entry.Metadata.FindProperty(CreatedAt) is not null)
                entry.Property(CreatedAt).CurrentValue = now;

            if (entry.Metadata.FindProperty(UpdatedAt) is not null)
                entry.Property(UpdatedAt).CurrentValue = now;
        }
    }
}
