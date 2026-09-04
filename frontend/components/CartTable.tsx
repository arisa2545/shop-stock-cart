"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCart } from "@/contexts/CartContext";
import { assetUrl } from "@/lib/api";
import { formatPricePerUnit, formatTHB } from "@/lib/format";
import type { CartItem } from "@/types";

const DEBOUNCE_MS = 350;

type Props = {
  items: CartItem[];
};

export function CartTable({ items }: Props) {
  const { updateQuantity } = useCart();
  const [drafts, setDrafts] = useState<Record<number, number>>({});
  const [savingProductIds, setSavingProductIds] = useState<Record<number, boolean>>({});
  const timersRef = useRef<Record<number, number>>({});
  const latestRequestRef = useRef<Record<number, number>>({});

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      for (const timer of Object.values(timers)) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  function dropDraft(productId: number, onlyIfEquals?: number) {
    setDrafts((prev) => {
      // ผู้ใช้กด +/- ต่อระหว่างรอ response → มี draft ใหม่แล้ว อย่าไปลบทับ
      if (onlyIfEquals !== undefined && prev[productId] !== onlyIfEquals) return prev;
      if (!(productId in prev)) return prev;

      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function displayQuantity(item: CartItem) {
    return drafts[item.productId] ?? item.quantity;
  }

  function scheduleSave(productId: number, quantity: number) {
    const existing = timersRef.current[productId];
    if (existing) window.clearTimeout(existing);

    timersRef.current[productId] = window.setTimeout(() => {
      delete timersRef.current[productId];
      void submitSave(productId, quantity);
    }, DEBOUNCE_MS);
  }

  async function submitSave(productId: number, quantity: number) {
    const requestId = (latestRequestRef.current[productId] ?? 0) + 1;
    latestRequestRef.current[productId] = requestId;

    setSavingProductIds((prev) => ({ ...prev, [productId]: true }));

    try {
      const ok = await updateQuantity(productId, quantity);
      if (latestRequestRef.current[productId] !== requestId) return;

      // สำเร็จ: ทิ้ง draft แล้วกลับไปอ่านค่าจาก server (ตัวเลขเท่ากัน ไม่มีกระพริบ)
      // ล้มเหลว: ทิ้ง draft เพื่อ revert กลับเป็นค่าจริง โดยไม่สนว่ามี draft ใหม่หรือยัง
      dropDraft(productId, ok ? quantity : undefined);
    } finally {
      if (latestRequestRef.current[productId] === requestId) {
        setSavingProductIds((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
    }
  }

  function changeQuantity(item: CartItem, delta: number) {
    const current = displayQuantity(item);
    const next = current + delta;

    if (next < 1 || next > item.stockQuantity) return;

    setDrafts((prev) => ({ ...prev, [item.productId]: next }));
    scheduleSave(item.productId, next);
  }

  return (
    <div className="cart-table-wrap">
      <table className="cart-table">
        <thead>
          <tr>
            <th scope="col">สินค้า</th>
            <th scope="col">ราคา/หน่วย</th>
            <th scope="col" className="cart-table__col-qty">
              จำนวน
            </th>
            <th scope="col" className="cart-table__col-total">
              รวม
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const image = assetUrl(item.imageUrl);
            const quantity = displayQuantity(item);
            const canIncrease = quantity < item.stockQuantity;
            const rowSaving = Boolean(savingProductIds[item.productId]);
            const lineTotal = item.unitPrice * quantity;

            return (
              <tr key={item.id}>
                <td>
                  <div className="cart-item">
                    <div className="cart-item__media">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="cart-item__img"
                        />
                      ) : (
                        <span className="cart-item__placeholder">{item.code}</span>
                      )}
                    </div>
                    <div>
                      <p className="cart-item__code">{item.code}</p>
                      <p className="cart-item__name">{item.name}</p>
                    </div>
                  </div>
                </td>
                <td className="cart-table__price">
                  {formatPricePerUnit(item.unitPrice, item.unit)}
                </td>
                <td className="cart-table__col-qty">
                  <QuantityStepper
                    quantity={quantity}
                    canIncrease={canIncrease}
                    pending={rowSaving}
                    onDecrease={() => changeQuantity(item, -1)}
                    onIncrease={() => changeQuantity(item, 1)}
                  />
                </td>
                <td className="cart-table__total">{formatTHB(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
