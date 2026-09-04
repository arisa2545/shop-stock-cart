"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartTable } from "@/components/CartTable";
import { CheckoutSuccessModal } from "@/components/CheckoutSuccessModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useCart } from "@/contexts/CartContext";
import { formatTHB } from "@/lib/format";
import type { CheckoutResult } from "@/types/checkout";

export function CartView() {
  const { cart, loading, error, refreshCart, clearCart, checkout } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmingCheckout, setConfirmingCheckout] = useState(false);
  const [payingOut, setPayingOut] = useState(false);
  const [receipt, setReceipt] = useState<CheckoutResult | null>(null);

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

  async function handleClear() {
    if (clearing) return;

    setClearing(true);
    try {
      await clearCart();
      setConfirmingClear(false);
    } finally {
      setClearing(false);
    }
  }

  async function handleCheckout() {
    if (payingOut) return;
    setPayingOut(true);

    try {
      const result = await checkout();
      setConfirmingCheckout(false);
      if (result) setReceipt(result);
    } finally {
      setPayingOut(false);
    }
  }

  function renderBody() {
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
      <>
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

        <div className="cart-actions">
          <button
            type="button"
            className="cart-actions__clear"
            onClick={() => setConfirmingClear(true)}
            disabled={clearing || payingOut}
          >
            ล้างตะกร้า
          </button>
          <button
            type="button"
            className="btn-primary cart-actions__checkout"
            onClick={() => setConfirmingCheckout(true)}
            disabled={clearing || payingOut}
          >
            {payingOut ? "กำลังชำระเงิน..." : `ชำระเงิน ${formatTHB(cart.totalAmount)}`}
          </button>
        </div>

        {confirmingCheckout ? (
          <ConfirmDialog
            title="ยืนยันการชำระเงิน"
            message={`ชำระ ${formatTHB(cart.totalAmount)} สำหรับสินค้า ${cart.items.length} รายการ (${cart.totalItems} ชิ้น) — สต๊อกจะถูกตัดหลังยืนยัน`}
            confirmLabel="ยืนยันชำระเงิน"
            pending={payingOut}
            onCancel={() => setConfirmingCheckout(false)}
            onConfirm={() => void handleCheckout()}
          />
        ) : null}

        {confirmingClear ? (
          <ConfirmDialog
            title="ล้างตะกร้าทั้งหมด?"
            message={`สินค้า ${cart.items.length} รายการ (${cart.totalItems} ชิ้น) จะถูกเอาออกจากตะกร้า สต๊อกไม่ได้รับผลกระทบเพราะยังไม่ได้ชำระเงิน`}
            confirmLabel="ล้างตะกร้า"
            danger
            pending={clearing}
            onCancel={() => setConfirmingClear(false)}
            onConfirm={() => void handleClear()}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      {renderBody()}
      {receipt ? <CheckoutSuccessModal result={receipt} /> : null}
    </>
  );
}
