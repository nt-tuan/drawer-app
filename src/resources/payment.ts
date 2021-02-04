import { CartState } from "store/cart/types";

export enum PaymentMethod {
  COD = "cod",
  BANK = "bank",
  MOMO = "momo",
  MOCA = "moca",
  ZALOPAY = "zalopay",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface PaymentOption {
  method: PaymentMethod;
  label: string;
  description: string;
  disabled?: boolean;
  helperText?: string;
}

export interface Payment {
  id: number;
  url: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  message: string;
}

export const computePaymentOptions = (cart: CartState): PaymentOption[] => {
  const total = getTotal(cart);
  return [
    {
      method: PaymentMethod.BANK,
      label: "Chuyển khoản ngân hàng",
      description: "Miễn phí giao hàng",
    },
    {
      method: PaymentMethod.MOMO,
      label: "Ví MoMo",
      description: "Miễn phí giao hàng",
      helperText:
        (total > 2e7 && "Chỉ có thể thanh toán tối đa 20 triệu đồng") ||
        (total < 1e4 && "Chỉ có thể thanh toán tối thiểu 10 nghìn đồng") ||
        undefined,
      disabled: total < 1e4 || total > 2e7,
    },
    {
      method: PaymentMethod.COD,
      label: "Tiền mặt",
      description: "Phí giao hàng " + formatPrice(35000),
    },
  ];
};
