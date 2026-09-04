"use client";

import Image from "next/image";
import { assetUrl } from "@/lib/api";
import { formatPricePerUnit, formatTHB } from "@/lib/format";
import type { CartItem } from "@/types";

type Props = {
  items: CartItem[];
};

export function CartTable({ items }: Props) {
  return (
    <div className="cart-table-wrap">
      <table className="cart-table">
        <thead>
          <tr>
            <th scope="col">สินค้า</th>
            <th scope="col">ราคา/หน่วย</th>
            <th scope="col">จำนวน</th>
            <th scope="col">รวม</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const image = assetUrl(item.imageUrl);

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
                <td>{formatPricePerUnit(item.unitPrice, item.unit)}</td>
                <td>{item.quantity}</td>
                <td className="cart-table__total">{formatTHB(item.lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
