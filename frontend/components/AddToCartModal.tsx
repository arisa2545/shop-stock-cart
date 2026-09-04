"use client";

import { useEffect, useId, useState } from "react";
import { formatPricePerUnit } from "@/lib/format";
import type { Product } from "@/types";

type Props = {
  product: Product;
  maxQuantity: number;
  pending: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
};

export function AddToCartModal({
  product,
  maxQuantity,
  pending,
  onClose,
  onConfirm,
}: Props) {
  const titleId = useId();
  const [quantity, setQuantity] = useState(1);
  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxQuantity;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pending]);

  async function handleConfirm() {
    if (pending || quantity < 1 || quantity > maxQuantity) return;
    await onConfirm(quantity);
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!pending) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <p className="modal__code">{product.code}</p>
            <h2 id={titleId} className="modal__title">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            disabled={pending}
            aria-label="ปิด"
          >
            ×
          </button>
        </header>

        <p className="modal__price">
          {formatPricePerUnit(product.unitPrice, product.unit)}
        </p>
        <p className="modal__hint">
          เพิ่มได้สูงสุด {maxQuantity} {product.unit}
          {maxQuantity < product.stockQuantity
            ? ` (ในตะกร้ามีอยู่แล้วบางส่วน · คงเหลือสต๊อก ${product.stockQuantity})`
            : null}
        </p>

        <div className="qty-stepper" aria-label="จำนวนที่ต้องการเพิ่ม">
          <button
            type="button"
            className="qty-stepper__btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={!canDecrease || pending}
            aria-label="ลดจำนวน"
          >
            −
          </button>
          <span className="qty-stepper__value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="qty-stepper__btn"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={!canIncrease || pending}
            aria-label="เพิ่มจำนวน"
          >
            +
          </button>
        </div>

        {!canIncrease && quantity >= maxQuantity ? (
          <p className="modal__cap">ครบจำนวนที่เพิ่มได้แล้ว</p>
        ) : null}

        <div className="modal__actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={pending}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn-add"
            onClick={handleConfirm}
            disabled={pending || maxQuantity < 1}
          >
            {pending ? "กำลังเพิ่ม..." : `เพิ่ม ${quantity} ${product.unit}`}
          </button>
        </div>
      </div>
    </div>
  );
}
