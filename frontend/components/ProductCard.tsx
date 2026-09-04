"use client";

import Image from "next/image";
import { assetUrl } from "@/lib/api";
import { formatPricePerUnit } from "@/lib/format";
import type { Product } from "@/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const outOfStock = product.stockQuantity <= 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity < 5;
  const image = assetUrl(product.imageUrl);

  return (
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
      </div>
    </article>
  );
}
