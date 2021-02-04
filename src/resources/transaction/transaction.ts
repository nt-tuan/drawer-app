import { Order } from "resources/order";

// Cash.ts`
export enum Cash {
  VND1000 = "vnd1000",
  VND2000 = "vnd2000",
  VND5000 = "vnd5000",
  VND10000 = "vnd10000",
  VND20000 = "vnd20000",
  VND50000 = "vnd50000",
  VND100000 = "vnd100000",
  VND200000 = "vnd200000",
  VND500000 = "vnd500000",
}

export function toVND(cash: Cash) {
  switch (cash) {
    case Cash.VND1000:
      return 1000;
    case Cash.VND2000:
      return 2000;
    case Cash.VND5000:
      return 5000;
    case Cash.VND10000:
      return 10000;
    case Cash.VND20000:
      return 20000;
    case Cash.VND50000:
      return 50000;
    case Cash.VND100000:
      return 100000;
    case Cash.VND200000:
      return 200000;
    case Cash.VND500000:
      return 500000;
  }
}
// Asset.ts
export type Asset = {
  [cash in Cash]: number;
};
export function getCashCount(asset: Asset) {
  return Object.values(Cash).reduce((count: number, current) => {
    if (asset[current] > 0) return count + asset[current];
    return count;
  }, 0);
}
export function getTotalBalance(
  asset: Asset,
  filter?: (cash: Cash, value: number) => boolean
) {
  return Object.values(Cash).reduce(
    (total, cash) =>
      total +
      (filter == null || filter(cash, asset[cash])
        ? asset[cash] * toVND(cash)
        : 0),
    0
  );
}
export function addAsset(a: Asset, b: Asset) {
  return Object.values(Cash).reduce((asset: Asset, cash) => {
    return { ...asset, [cash]: a[cash] + b[cash] };
  }, newAsset());
}

export enum TransactionStatus {
  PENDING = "pending",
  DRAFT = "draft",
  COMMITED = "committed",
}
export enum TransactionType {
  ORDER = "order",
  RESET = "reset",
}
// Transaction.ts
export interface Transaction extends Asset {
  status: TransactionStatus;
  type: TransactionType;
  orders?: Order[];
  id: string;
  createdAt: Date;
}

export interface Drawer extends Asset {}

export const CashImages: { [key in Cash]: string } = {
  vnd1000: `url("/cash/vnd1000.png")`,
  vnd2000: `url("/cash/vnd2000.png")`,
  vnd5000: `url("/cash/vnd5000.png")`,
  vnd10000: `url("/cash/vnd10000.png")`,
  vnd20000: `url("/cash/vnd20000.png")`,
  vnd50000: `url("/cash/vnd50000.png")`,
  vnd100000: `url("/cash/vnd100000.jpg")`,
  vnd200000: `url("/cash/vnd200000.png")`,
  vnd500000: `url("/cash/vnd500000.png")`,
};

export const newAsset = (): Asset => {
  return {
    vnd1000: 0,
    vnd2000: 0,
    vnd5000: 0,
    vnd10000: 0,
    vnd20000: 0,
    vnd50000: 0,
    vnd100000: 0,
    vnd200000: 0,
    vnd500000: 0,
  };
};
export const multipleAsset = (asset: Asset, factor: number) => {
  return Object.values(Cash).reduce(
    (asset: Asset, cash) => ({ ...asset, [cash]: asset[cash] * factor }),
    asset
  );
};
