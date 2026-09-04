"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon } from "@/components/icons";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const onCart = pathname.startsWith("/cart");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden />
          <span className="brand__text">ShopStock</span>
        </Link>

        <nav className="site-nav" aria-label="หลัก">
          <Link
            href="/"
            className={`site-nav__link ${pathname === "/" ? "is-active" : ""}`}
          >
            สินค้า
          </Link>
          <Link
            href="/cart"
            className={`cart-link ${onCart ? "is-active" : ""}`}
            aria-label={`ตะกร้าสินค้า ${totalItems} รายการ`}
          >
            <CartIcon />
            <span>ตะกร้า</span>
            {totalItems > 0 ? (
              <span className="cart-badge" aria-hidden>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
