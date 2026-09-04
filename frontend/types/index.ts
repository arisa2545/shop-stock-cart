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

export type ApiError = {
  code: string;
  message: string;
};
