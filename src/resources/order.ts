import api from "./api";
import { Payment } from "./payment";
import { Address } from "./address";
import { Product } from "./product";
import { User } from "./user";

interface PlaceOrderBody {
  address_id: number;
  payment_method: string;
  voucher?: string;
  items: {
    id: number;
    quantity: number;
    note: string;
  }[];
}

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
  address: Address;
  payment: Payment;
  discount: number;
  status: OrderStatus;
  voucher?: string;
  shipping_fee: number;
  items: OrderItem[];
  user: User;
}

export async function placeOrder(token: string, body: PlaceOrderBody) {
  return api.post<Order>("/order/create", token, JSON.stringify(body));
}

export async function getOrder(token: string, id: string) {
  return api.get<Order>(`/order/${id}`, token);
}
