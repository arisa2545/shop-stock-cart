"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartModal } from "@/components/AddToCartModal";
import { assetUrl } from "@/lib/api";
import { formatPricePerUnit } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { cart, addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const outOfStock = product.stockQuantity <= 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity < 5;
  const image = assetUrl(product.imageUrl);
  const inCart =
    cart?.items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const maxQuantity = Math.max(0, product.stockQuantity - inCart);
  const atCartLimit = !outOfStock && maxQuantity <= 0;

  async function handleConfirm(quantity: number) {
    setPending(true);
    try {
      const response = await addToCart(product.id, quantity);
      if (response) setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <article className="product-card">
        <div className="product-card__media">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              className="product-card__img"
            />
          ) : (
            <div className="product-card__placeholder" aria-hidden>
              {product.code}
            </div>
          )}

          {outOfStock ? (
            <span className="stock-badge stock-badge--out">สินค้าหมด</span>
          ) : lowStock ? (
            <span className="stock-badge stock-badge--low">เหลือน้อย</span>
          ) : null}
        </div>

        <div className="product-card__body">
          <p className="product-card__code">{product.code}</p>
          <h2 className="product-card__name">{product.name}</h2>
          {product.description ? (
            <p className="product-card__desc">{product.description}</p>
          ) : null}
          <p className="product-card__price">
            {formatPricePerUnit(product.unitPrice, product.unit)}
          </p>
          <p className="product-card__stock">
            คงเหลือ {product.stockQuantity} {product.unit}
          </p>

          <button
            type="button"
            className="btn-add"
            disabled={outOfStock || atCartLimit}
            onClick={() => setOpen(true)}
          >
            {outOfStock
              ? "สินค้าหมด"
              : atCartLimit
                ? "ครบจำนวนคงเหลือแล้ว"
                : "หยิบใส่ตะกร้า"}
          </button>
        </div>
      </article>

      {open ? (
        <AddToCartModal
          product={product}
          maxQuantity={maxQuantity}
          pending={pending}
          onClose={() => {
            if (!pending) setOpen(false);
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </>
  );
}
