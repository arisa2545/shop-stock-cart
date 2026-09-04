"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await api.getProducts();
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) {
          setError("โหลดรายการสินค้าไม่สำเร็จ ตรวจว่า Backend รันอยู่หรือยัง");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="product-grid" aria-busy="true" aria-label="กำลังโหลดสินค้า">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-skeleton" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box state-box--error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="state-box">
        <p>ยังไม่มีสินค้าในระบบ</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
