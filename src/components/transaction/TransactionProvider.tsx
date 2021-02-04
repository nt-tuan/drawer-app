import React from "react";
import { TransactionContext, TransactionSet } from "./TransactionContext";
import { useLocalStorage } from "react-use";
import { Order } from "resources/order";
import { v4 } from "uuid";
import {
  addAsset,
  Asset,
  Drawer,
  newAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "resources/transaction/transaction";

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initDrawer, setDrawer] = useLocalStorage<Drawer>("drawer");
  const [transactions, setTransactions] = useLocalStorage<TransactionSet>(
    "transactions",
    {}
  );
  const drawer: Drawer = React.useMemo(() => {
    let tempDrawer: Asset = initDrawer ?? newAsset();
    if (transactions === undefined) return tempDrawer;
    return Object.values(transactions).reduce((drawer: Drawer, tx) => {
      if (tx.type === TransactionType.RESET) return { ...tx };
      return { ...drawer, ...addAsset(drawer, tx) };
    }, tempDrawer);
  }, [initDrawer, transactions]);
  const [lsOrders, setLsOrders] = useLocalStorage<Order[]>("orders", []);
  const [orders, setOrders] = React.useState<Order[]>(lsOrders ?? []);
  const [lsDraftTransactions, setLsDraftTransactions] = useLocalStorage<
    TransactionSet
  >("draftTransaction", {});
  const [draftTransactions, setDraftTransaction] = React.useState<
    TransactionSet
  >(lsDraftTransactions ?? {});

  const [selectedTransaction, setSelected] = useLocalStorage<Transaction>(
    "selectedTransaction"
  );
  const onOrderSelected = React.useCallback(
    (order: Order) => {
      const newSelected: Transaction = selectedTransaction ?? {
        orders: [],
        type: TransactionType.ORDER,
        status: TransactionStatus.DRAFT,
        createdAt: new Date(),
        id: v4(),
        ...newAsset(),
      };
      const createdAt = new Date();
      setSelected({
        ...newSelected,
        orders: [...(newSelected.orders ?? []), order],
        createdAt,
      });
    },
    [selectedTransaction, setSelected]
  );
  const onOrderDeselected = (order: Order) => {
    if (selectedTransaction == null || selectedTransaction.orders == null)
      return;
    const orders = selectedTransaction.orders.filter(
      (filteredOrder) => filteredOrder.localId === order.localId
    );
    setSelected({ ...selectedTransaction, orders });
  };
  const onOrderPaid = React.useCallback(
    (paidTx: Transaction) => {
      if (transactions == null) return;
      const newSet = Object.values(transactions).reduce(
        (set: TransactionSet, tx) => {
          if (tx.id === paidTx.id) {
            return { ...set, [tx.id]: paidTx };
          }
          if (tx.orders == null) return { ...set, [tx.id]: tx };
          if (paidTx.orders == null) return set;
          if (
            tx.orders.filter(
              (order) =>
                paidTx.orders &&
                paidTx.orders.filter((paidOrder) => paidOrder.id === order.id)
                  .length > 0
            ).length > 0
          )
            return set;
          return { ...set, [tx.id]: tx };
        },
        transactions
      );
      setTransactions(newSet);
    },
    [transactions, setTransactions]
  );

  React.useEffect(() => {
    setLsOrders(orders);
  }, [orders, setLsOrders]);
  React.useEffect(() => setLsDraftTransactions(draftTransactions), [
    draftTransactions,
    setLsDraftTransactions,
  ]);
  const onOrderLent = (transaction: Transaction) => {};
  const onOrderShiped = (transaction: Transaction) => {};
  return (
    <TransactionContext.Provider
      value={{
        drawer,
        setDrawer,
        transactions: transactions ?? {},
        draftTransactions,
        setTransactions,
        setDraftTransactions: setDraftTransaction,
        orders: orders ?? [],
        setOrders,
        selectedTransaction: selectedTransaction,
        onOrderSelected,
        onOrderDeselected,
        onOrderPaid,
        onOrderLent,
        onOrderShiped,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
