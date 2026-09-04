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

type ToastState = {
  message: string;
  tone: "success" | "error";
} | null;

type CartContextValue = {
  cart: Cart | null;
  cartId: string | null;
  totalItems: number;
  loading: boolean;
  error: string | null;
  toast: ToastState;
  clearToast: () => void;
  ensureCart: () => Promise<string>;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  removeItem: (productId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const clearToast = useCallback(() => setToast(null), []);

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

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      try {
        const id = await ensureCart();
        const next = await api.addToCart(id, productId, quantity);
        setCart(next);
        setToast({ message: "เพิ่มลงตะกร้าแล้ว", tone: "success" });
        return true;
      } catch (err) {
        if (err instanceof ApiRequestError) {
          // ตะกร้าหายกลางทาง → สร้างใหม่แล้วลองอีกครั้ง
          if (err.status === 404) {
            try {
              const id = await createAndPersistCart();
              const next = await api.addToCart(id, productId, quantity);
              setCart(next);
              setToast({ message: "เพิ่มลงตะกร้าแล้ว", tone: "success" });
              return true;
            } catch (retryErr) {
              const message =
                retryErr instanceof ApiRequestError
                  ? retryErr.message
                  : "เพิ่มสินค้าไม่สำเร็จ";
              setToast({ message, tone: "error" });
              return false;
            }
          }

          setToast({ message: err.message, tone: "error" });
          return false;
        }

        setToast({ message: "เพิ่มสินค้าไม่สำเร็จ", tone: "error" });
        return false;
      }
    },
    [createAndPersistCart, ensureCart],
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      try {
        const id = await ensureCart();
        const next = await api.updateCartItem(id, productId, quantity);
        setCart(next);
        return true;
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setToast({ message: err.message, tone: "error" });
          return false;
        }

        setToast({ message: "ปรับจำนวนไม่สำเร็จ", tone: "error" });
        return false;
      }
    },
    [ensureCart],
  );

  const removeItem = useCallback(
    async (productId: number) => {
      try {
        const id = await ensureCart();
        const next = await api.removeCartItem(id, productId);
        setCart(next);
        setToast({ message: "ลบสินค้าออกจากตะกร้าแล้ว", tone: "success" });
        return true;
      } catch (err) {
        if (err instanceof ApiRequestError) {
          // ลบไปแล้ว (กดปุ่มรัว) → ผลลัพธ์ที่ผู้ใช้ต้องการเกิดขึ้นแล้ว ไม่ต้องขึ้น toast แดง
          if (err.code === "CART_ITEM_NOT_FOUND") {
            await ensureCart();
            return true;
          }

          if (err.status === 404) {
            await createAndPersistCart();
            return true;
          }

          setToast({ message: err.message, tone: "error" });
          return false;
        }

        setToast({ message: "ลบสินค้าไม่สำเร็จ", tone: "error" });
        return false;
      }
    },
    [createAndPersistCart, ensureCart],
  );

  const clearCart = useCallback(async () => {
    try {
      const id = await ensureCart();
      const next = await api.clearCart(id);
      setCart(next);
      setToast({ message: "ล้างตะกร้าแล้ว", tone: "success" });
      return true;
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 404) {
          await createAndPersistCart();
          return true;
        }

        setToast({ message: err.message, tone: "error" });
        return false;
      }

      setToast({ message: "ล้างตะกร้าไม่สำเร็จ", tone: "error" });
      return false;
    }
  }, [createAndPersistCart, ensureCart]);

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

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        totalItems: cart?.totalItems ?? 0,
        loading,
        error,
        toast,
        clearToast,
        ensureCart,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
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
