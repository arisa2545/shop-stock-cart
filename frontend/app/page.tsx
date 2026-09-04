import { ProductList } from "@/components/ProductList";
import "@/styles/product-list.css";

export default function HomePage() {
  return (
    <>
      <header className="page-head">
        <h1>รายการสินค้า</h1>
        <p>ดูสินค้าและจำนวนคงเหลือในสต๊อก</p>
      </header>
      <ProductList />
    </>
  );
}
