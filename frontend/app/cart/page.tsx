import Link from "next/link";

export default function CartPage() {
  return (
    <div className="cart-stub">
      <h1>ตะกร้าสินค้า</h1>
      <p>หน้านี้ยังไม่พร้อม — จะทำต่อหลังจากรายการสินค้า</p>
      <p style={{ marginTop: "0.75rem" }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>
          กลับไปหน้ารายการสินค้า →
        </Link>
      </p>
    </div>
  );
}
