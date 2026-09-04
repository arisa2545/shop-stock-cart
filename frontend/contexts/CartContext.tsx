"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, ApiRequestError } from "@/lib/api";
import type { Cart } from "@/types";

const CART_STORAGE_KEY = "shop-stock-cart:cartId";

/** กัน create ซ้ำตอน Provider + หน้า cart / React Strict Mode ยิงพร้อมกัน */
let ensureCartInFlight: Promise<string> | null = null;

type CartContextValue = {
  cart: Cart | null;
  cartId: string | null;
  loading: boolean;
  error: string | null;
  ensureCart: () => Promise<string>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistCartId = useCallback((id: string) => {
    localStorage.setItem(CART_STORAGE_KEY, id);
    setCartId(id);
  }, []);

  const createAndPersistCart = useCallback(async () => {
    const created = await api.createCart();
    persistCartId(created.cartId);
    const next = await api.getCart(created.cartId);
    setCart(next);
    return created.cartId;
  }, [persistCartId]);

  const ensureCart = useCallback(async () => {
    if (ensureCartInFlight) {
      return ensureCartInFlight;
    }

    ensureCartInFlight = (async () => {
      const existing = localStorage.getItem(CART_STORAGE_KEY);

      if (!existing) {
        return createAndPersistCart();
      }

      try {
        const next = await api.getCart(existing);
        persistCartId(existing);
        setCart(next);
        return existing;
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 404) {
          return createAndPersistCart();
        }
        throw err;
      }
    })();

    try {
      return await ensureCartInFlight;
    } finally {
      ensureCartInFlight = null;
    }
  }, [createAndPersistCart, persistCartId]);

  const refreshCart = useCallback(async () => {
    setError(null);
    await ensureCart();
  }, [ensureCart]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await ensureCart();
        if (!cancelled) setError(null);
      } catch {
        if (!cancelled) {
          setError("โหลดตะกร้าไม่สำเร็จ ตรวจว่า Backend รันอยู่หรือยัง");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        loading,
        error,
        ensureCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart ต้องอยู่ภายใน CartProvider");
  }
  return ctx;
}
