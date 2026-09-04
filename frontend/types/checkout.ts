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
