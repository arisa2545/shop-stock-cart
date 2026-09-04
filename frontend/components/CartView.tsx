"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartTable } from "@/components/CartTable";
import { useCart } from "@/contexts/CartContext";
import { formatTHB } from "@/lib/format";

export function CartView() {
  const { cart, loading, error, refreshCart } = useCart();
  const [refreshing, setRefreshing] = useState(false);

  // รอ Provider โหลดจบก่อน แล้วค่อย GET ใหม่
  useEffect(() => {
    if (loading) return;

    let cancelled = false;

    (async () => {
      setRefreshing(true);
      try {
        await refreshCart();
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, refreshCart]);

  if (loading || refreshing) {
    return (
      <div className="cart-panel" aria-busy="true">
        <div className="cart-skeleton" />
        <div className="cart-skeleton cart-skeleton--short" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-state cart-state--error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-state">
        <p>ยังไม่มีสินค้าในตะกร้า</p>
        <Link href="/" className="cart-state__link">
          กลับไปหน้ารายการสินค้า →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-panel">
      <CartTable items={cart.items} />
      <div className="cart-summary">
        <div className="cart-summary__row">
          <span>จำนวนทั้งหมด</span>
          <span>{cart.totalItems} ชิ้น</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>ยอดที่ต้องชำระ</span>
          <span>{formatTHB(cart.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
