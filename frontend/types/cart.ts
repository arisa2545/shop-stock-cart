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
