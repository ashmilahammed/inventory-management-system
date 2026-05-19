export interface Sale {
  id?: string;
  itemId: string;
  quantity: number;
  customerId?: string;
  isCash: boolean;
  totalAmount: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
