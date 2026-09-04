import { CartView } from "@/components/CartView";
import "@/styles/cart.css";

export default function CartPage() {
  return (
    <>
      <header className="page-head">
        <h1>ตะกร้าสินค้า</h1>
        <p>รายการในตะกร้าจากเซิร์ฟเวอร์ — ยังไม่รองรับแก้ไขในรอบนี้</p>
      </header>
      <CartView />
    </>
  );
}
