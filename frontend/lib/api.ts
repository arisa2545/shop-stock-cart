import type { ApiError, Product } from "@/types";

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
};

/** รวม base ของ static files กับ path จาก BE เช่น /products/P001.jpg */
export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_ASSET_URL ?? "http://localhost:5223";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
