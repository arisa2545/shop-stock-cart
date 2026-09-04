"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
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
            aria-label="ตะกร้าสินค้า"
          >
            <CartIcon />
            <span>ตะกร้า</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
