"use client";

type Props = {
  quantity: number;
  canIncrease: boolean;
  pending?: boolean;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({
  quantity,
  canIncrease,
  pending = false,
  disabled = false,
  onDecrease,
  onIncrease,
}: Props) {
  const canDecrease = quantity > 1;
  const atMax = !canIncrease;
  const statusMessage = atMax
      ? "ครบจำนวนคงเหลือแล้ว"
      : null;

  return (
    <div className={`cart-qty-block${pending ? " is-pending" : ""}`}>
      <div className="cart-qty" aria-label="ปรับจำนวน">
        <button
          type="button"
          className="cart-qty__btn"
          onClick={onDecrease}
          disabled={disabled || !canDecrease}
          aria-label="ลดจำนวน"
          title={!canDecrease ? "ถึงจำนวนขั้นต่ำแล้ว" : undefined}
        >
          −
        </button>
        <span className="cart-qty__value" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="cart-qty__btn"
          onClick={onIncrease}
          disabled={disabled || !canIncrease}
          aria-label="เพิ่มจำนวน"
          title={atMax ? "ครบจำนวนคงเหลือแล้ว" : undefined}
        >
          +
        </button>
      </div>

      {statusMessage ? (
        <p
          className={`cart-qty__status${
            pending ? " cart-qty__status--pending" : " cart-qty__status--max"
          }`}
          aria-live="polite"
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
