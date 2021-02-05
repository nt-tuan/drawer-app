import React from "react";
import { TransactionContext, TransactionSet } from "./TransactionContext";
import { useLocalStorage } from "react-use";
import { Order } from "resources/order";
import { v4 } from "uuid";
import {
  addAsset,
  Asset,
  Cash,
  Drawer,
  newAsset,
  Transaction,
} from "resources/transaction/transaction";
import {
  InvalidPaidOrderTransaction,
  NegativeCashNumber,
  OrderTransactionExisted,
  TransactionCommittedError,
  TransactionNotFoundError,
} from "constants/errors";

const getDrawer = (initDrawer: Drawer | undefined, txs: Transaction[]) => {
  let drawer = initDrawer ? { ...initDrawer } : newAsset();
  for (let i = 0; i < txs.length; i++) {
    if (txs[i].type === "reset") drawer = { ...txs[i] };
    else if (txs[i].type === "order") drawer = addAsset(drawer, txs[i]);
  }
  return drawer;
};
const isValidDrawer = (drawer: Drawer) => {
  return Object.values(Cash).filter((cash) => drawer[cash] < 0).length === 0;
};
const getEditableTransaction = (
  transactions: TransactionSet | undefined,
  id: string
) => {
  if (transactions == null || !(id in transactions)) {
    throw Error(TransactionNotFoundError);
  }
  const tx = transactions[id];
  if (tx.status === "committed") {
    throw Error(TransactionCommittedError);
  }
  return tx;
};
const checkTransactionSet = (
  initDrawer: Drawer | undefined,
  txsSet: TransactionSet
) => {
  if (!isValidDrawer(getDrawer(initDrawer, Object.values(txsSet)))) {
    throw Error(NegativeCashNumber);
  }
};
const checkOrderTransaction = (
  transactions: TransactionSet,
  orders?: Order[]
) => {
  if (orders == null) throw new Error(InvalidPaidOrderTransaction);
  const has =
    Object.values(transactions).filter((tx) => {
      if (tx.orders == null) return false;
      return (
        tx.orders.filter(
          (order) =>
            orders &&
            orders.filter(
              (checkedOrder) => checkedOrder.localId === order.localId
            ).length > 0
        ).length > 0
      );
    }).length > 0;
  if (has) throw new Error(OrderTransactionExisted);
};

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
    const drawer: Asset = initDrawer ?? newAsset();
    if (transactions === undefined) return drawer;
    return getDrawer(drawer, Object.values(transactions));
  }, [initDrawer, transactions]);
  const [lsOrders, setLsOrders] = useLocalStorage<Order[]>("orders", []);
  const [orders, setOrders] = React.useState<Order[]>(lsOrders ?? []);
  const [
    lsDraftTransactions,
    setLsDraftTransactions,
  ] = useLocalStorage<TransactionSet>("draftTransaction", {});
  const [
    draftTransactions,
    setDraftTransaction,
  ] = React.useState<TransactionSet>(lsDraftTransactions ?? {});

  const [selectedTransaction, setSelected] = useLocalStorage<Transaction>(
    "selectedTransaction"
  );
  const onOrderSelected = React.useCallback(
    (order: Order) => {
      const newSelected: Transaction = selectedTransaction ?? {
        orders: [],
        type: "order",
        status: "draft",
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
  const onTransactionDelete = React.useCallback(
    (deletedTx: Transaction) => {
      const tx = getEditableTransaction(transactions, deletedTx.id);
      const newSet = { ...transactions };
      delete newSet[deletedTx.id];
      checkTransactionSet(initDrawer, newSet);
      // add exists order
      if (tx.orders) {
        setOrders([...orders, ...tx.orders]);
      }
      setTransactions(newSet);
    },
    [transactions, setTransactions, initDrawer, orders]
  );
  const onTransactionEdit = React.useCallback(
    (editedTx: Transaction) => {
      getEditableTransaction(transactions, editedTx.id);
      const newSet = { ...transactions, [editedTx.id]: editedTx };
      checkTransactionSet(initDrawer, newSet);
      setTransactions(newSet);
    },
    [transactions, setTransactions, initDrawer]
  );
  const onAddTransaction = React.useCallback(
    (editingTransaction: Transaction) => {
      if (transactions == null) return;
      editingTransaction.orders &&
        checkOrderTransaction(transactions, editingTransaction.orders);
      const newTx: Transaction = {
        ...editingTransaction,
        createdAt: new Date(),
        status: "pending",
      };
      const newTxs = Object.values(draftTransactions).reduce(
        (set: TransactionSet, tx) => {
          if (editingTransaction.id === tx.id) return set;
          if (editingTransaction.orders == null)
            return {
              ...set,
              [tx.id]: tx,
            };
          const hasEditingOrders =
            editingTransaction.orders.filter(
              (editingOrder) =>
                tx.orders &&
                tx.orders.filter(
                  (order) => order.localId === editingOrder.localId
                ).length > 0
            ).length > 0;
          if (hasEditingOrders) {
            return set;
          }
          return { ...set, [tx.id]: tx };
        },
        {}
      );
      setLsDraftTransactions(newTxs);
      setTransactions((txs) => ({ ...txs, [newTx.id]: newTx }));
      if (editingTransaction.orders == null) return;
      const newOrders = orders.map((order) => {
        if (editingTransaction.orders == null) {
          return order;
        }
        const has =
          editingTransaction.orders.filter(
            (editingOrder) => editingOrder.localId === order.localId
          ).length > 0;
        if (has) {
          order.status = "pending";
        }
        return order;
      });
      setOrders(newOrders);
    },
    [
      orders,
      setTransactions,
      transactions,
      draftTransactions,
      setLsDraftTransactions,
    ]
  );
  React.useEffect(() => {
    setLsOrders(orders);
  }, [orders, setLsOrders]);
  React.useEffect(() => setLsDraftTransactions(draftTransactions), [
    draftTransactions,
    setLsDraftTransactions,
  ]);

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
        onAddTransaction,
        onTransactionDelete,
        onTransactionEdit,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
