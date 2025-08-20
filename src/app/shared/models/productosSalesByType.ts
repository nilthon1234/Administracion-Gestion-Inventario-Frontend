export interface ProductSalesByType {
  type: string;
  products: Array<{
    codToday: string;
    totalAmount: number;
  }>;
}