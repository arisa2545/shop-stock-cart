"use client";

import { useCart } from "@/contexts/CartContext";

export function Toast() {
  const { toast, clearToast } = useCart();

  if (!toast) return null;

  return (
    <div
      className={`toast toast--${toast.tone}`}
      role="status"
      aria-live="polite"
    >
      <p>{toast.message}</p>
      <button type="button" className="toast__close" onClick={clearToast}>
        ปิด
      </button>
    </div>
  );
}
