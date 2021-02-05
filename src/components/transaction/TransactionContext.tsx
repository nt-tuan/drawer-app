import { createContext } from "react";
import { Order } from "resources/order";
import { Drawer, Transaction } from "resources/transaction/transaction";
export interface TransactionSet {
  [key: string]: Transaction;
}
export interface OrderSet {
  [key: string]: Order;
}

export interface TransactionContextState {
  drawer?: Drawer;
  setDrawer: React.Dispatch<React.SetStateAction<Drawer | undefined>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  transactions: TransactionSet;
  selectedTransaction?: Transaction;
  draftTransactions: TransactionSet;
  setTransactions: React.Dispatch<
    React.SetStateAction<TransactionSet | undefined>
  >;
  setDraftTransactions: React.Dispatch<React.SetStateAction<TransactionSet>>;
  onOrderSelected: (_: Order) => void;
  onOrderDeselected: (_: Order) => void;
  onAddTransaction: (_: Transaction) => void;
  onTransactionDelete: (_: Transaction) => void;
  onTransactionEdit: (_: Transaction) => void;
}
const fooFunc = () => {};
export const TransactionContext = createContext<TransactionContextState>({
  orders: [],
  setDrawer: fooFunc,
  setOrders: fooFunc,
  transactions: {},
  draftTransactions: {},
  setTransactions: fooFunc,
  setDraftTransactions: fooFunc,
  onOrderSelected: fooFunc,
  onOrderDeselected: fooFunc,
  onAddTransaction: fooFunc,
  onTransactionDelete: fooFunc,
  onTransactionEdit: fooFunc,
});
