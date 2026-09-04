export type Product = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unitPrice: number;
  unit: string;
  imageUrl: string | null;
  stockQuantity: number;
};

export type CartItem = {
  id: number;
  productId: number;
  code: string;
  name: string;
  imageUrl: string | null;
  unit: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockQuantity: number;
  canIncrease: boolean;
};

export type Cart = {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

export type CheckoutItem = {
  productId: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type CheckoutResult = {
  orderId: number;
  orderNo: string;
  createdAt: string;
  totalItems: number;
  totalAmount: number;
  items: CheckoutItem[];
};

export type ApiError = {
  code: string;
  message: string;
};
