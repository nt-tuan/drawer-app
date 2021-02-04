import { Product } from "./product";
import { User } from "./user";
export enum OrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  PLACED = "placed",
}

export interface OrderItem {
  id: number;
  discount: number;
  product: Product;
  quantity: number;
  price: number;
  note: string;
}

export interface Order {
  localId: string;
  id: number;
  total: number;
  discount: number;
  status: OrderStatus;
  voucher?: string;
  shipping_fee: number;
  items: OrderItem[];
  user: User;
}
