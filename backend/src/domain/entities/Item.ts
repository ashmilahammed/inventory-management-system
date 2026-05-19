export interface Item {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
