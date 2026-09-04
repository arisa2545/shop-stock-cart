import type { ApiError } from "@/types/api";
import type { Cart } from "@/types/cart";
import type { CheckoutResult } from "@/types/checkout";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5223/api";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.message || "เกิดข้อผิดพลาด");
    this.name = "ApiRequestError";
    this.status = status;
    this.code = data.code;
    this.data = data;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let data: ApiError = {
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาด",
    };

    try {
      data = (await res.json()) as ApiError;
    } catch {
      // keep fallback
    }

    throw new ApiRequestError(res.status, data);
  }

  return (await res.json()) as T;
}

export const api = {
  getProducts: () => request<Product[]>("/products"),

  createCart: () => request<{ cartId: string }>("/carts", { method: "POST" }),

  getCart: (cartId: string) => request<Cart>(`/carts/${cartId}`),

  addToCart: (cartId: string, productId: number, quantity = 1) =>
    request<Cart>(`/carts/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  updateCartItem: (cartId: string, productId: number, quantity: number) =>
    request<Cart>(`/carts/${cartId}/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeCartItem: (cartId: string, productId: number) =>
    request<Cart>(`/carts/${cartId}/items/${productId}`, { method: "DELETE" }),

  clearCart: (cartId: string) =>
    request<Cart>(`/carts/${cartId}/items`, { method: "DELETE" }),

  /** ไม่ส่ง cartItemIds = จ่ายทั้งตะกร้า · ส่ง array = จ่ายเฉพาะที่เลือก (ตอนนี้เป็นการจ่ายทั้ง cart) */
  checkout: (cartId: string, cartItemIds?: number[]) =>
    request<CheckoutResult>(`/carts/${cartId}/checkout`, {
      method: "POST",
      body: JSON.stringify({ cartItemIds: cartItemIds ?? [] }),
    }),
};

/** รวม base ของ static files กับ path จาก BE เช่น /products/P001.jpg */
export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_ASSET_URL ?? "http://localhost:5223";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
