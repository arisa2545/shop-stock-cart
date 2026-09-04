"use client";

import { useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { formatTHB } from "@/lib/format";
import type { CheckoutResult } from "@/types";

const dateTime = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
});

type Props = {
  result: CheckoutResult;
};

export function CheckoutSuccessModal({ result }: Props) {
  const router = useRouter();
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function goHome() {
    router.replace("/");
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="receipt">
          <header className="receipt__head">
            <p className="receipt__eyebrow">ชำระเงินสำเร็จ</p>
            <h2 id={titleId} className="receipt__no">
              {result.orderNo}
            </h2>
            <p className="receipt__time">{dateTime.format(new Date(result.createdAt))}</p>
          </header>

          <ul className="receipt__items">
            {result.items.map((item) => (
              <li key={item.productId} className="receipt__row">
                <div>
                  <p className="receipt__code">{item.productCode}</p>
                  <p className="receipt__name">{item.productName}</p>
                  <p className="receipt__calc">
                    {formatTHB(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <span className="receipt__line-total">{formatTHB(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="receipt__totals">
            <div className="receipt__total-row">
              <span>จำนวนทั้งหมด</span>
              <span>{result.totalItems} ชิ้น</span>
            </div>
            <div className="receipt__total-row receipt__total-row--grand">
              <span>ยอดที่ชำระ</span>
              <span>{formatTHB(result.totalAmount)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary receipt__home"
          onClick={goHome}
          autoFocus
        >
          กลับไปหน้าสินค้า
        </button>
      </div>
    </div>
  );
}
