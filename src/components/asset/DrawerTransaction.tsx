import React from "react";
import {
  Drawer,
  Asset,
  newAsset,
  Cash,
  getTotalBalance,
  toVND,
  addAsset,
  multipleAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "resources/transaction/transaction";
import { AssetPicker } from "./AssetPicker";
import { AssetView } from "./AssetView";
import { suggestAsset } from "common/suggestAsset";
import { PriorityQueue } from "common/PriorityQueue";
import { WithdrawSuggestion } from "./WithdrawSuggestion";
import numeral from "numeral";
import { Order, OrderStatus } from "resources/order";
import {
  TransactionContext,
  TransactionSet,
} from "components/transaction/TransactionContext";
import { v4 } from "uuid";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";

interface Props {
  orders: Order[];
}

interface ViewProps {
  drawer: Drawer;
  total: number;
  asset: Asset;
  suggestions: Asset[];
  onApplySuggestion: (asset: Asset, requestMore: number) => void;
  onUp: (cash: Cash) => void;
  onDown: (cash: Cash) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const AssetTotalValue = ({
  asset,
  total,
  label,
}: {
  asset?: Asset;
  total?: number;
  label: string;
}) => {
  const myTotal = asset ? getTotalBalance(asset) : total;
  return (
    <Flex justify="space-between" alignItems="baseline" textColor="gray.500">
      <span>{label}</span>
      <Box as="span" fontSize="lg" fontWeight="bold" textColor="gray.700">
        {" "}
        {numeral(myTotal).format("0,0$")}
      </Box>
    </Flex>
  );
};

const DrawerTransactionView = ({
  drawer,
  total,
  asset,
  suggestions,
  onApplySuggestion,
  onUp,
  onDown,
  onReset,
  onConfirm,
}: ViewProps) => {
  const getAsset = React.useCallback(
    (filter: (cash: Cash, count: number) => boolean) => {
      return Object.values(Cash).reduce((filtered: Asset, cash) => {
        if (filter(cash, asset[cash]))
          return { ...filtered, [cash]: asset[cash] };
        return filtered;
      }, newAsset());
    },
    [asset]
  );

  const withdrawal = React.useMemo(
    () =>
      multipleAsset(
        getAsset((_cash, count) => count < 0),
        -1
      ),
    [getAsset]
  );
  const deposit = React.useMemo(() => getAsset((_cash, count) => count > 0), [
    getAsset,
  ]);

  const balance = React.useMemo(() => getTotalBalance(asset), [asset]);
  const renderAssetTypeExtra = (cash: Cash) => (
    <Flex justify="between">
      <Box
        px={2}
        fontWeight="bold"
        textColor="gray.600"
        backgroundColor="gray.100"
        rounded="base"
        shadow="base"
      >
        {drawer[cash] + asset[cash]}
      </Box>
    </Flex>
  );

  const getIntent = React.useCallback(
    (cash: Cash) => {
      if (asset[cash] > 0 && balance - toVND(cash) >= total) {
        return "yellow";
      }
      if (suggestions.length > 0) {
        const currentSuggestion = suggestions[0];
        return currentSuggestion[cash] > 0 ? "red" : undefined;
      }
      return undefined;
    },
    [asset, total, suggestions, balance]
  );
  return (
    <Flex direction="column" justify="stretch" h="100%" bgColor="white" px={1}>
      <Box pb={2}>
        <AssetPicker
          getIntent={getIntent}
          asset={asset}
          onUp={onUp}
          onDown={onDown}
          renderAssetTypeExtra={renderAssetTypeExtra}
        />
      </Box>
      <Flex
        alignItems="stretch"
        justify="space-between"
        flex={1}
        h={0}
        pb={2}
        my={1}
        overflow="hidden"
      >
        <Box flex={1}>
          <Flex
            direction="column"
            h="100%"
            rounded="lg"
            shadow="base"
            alignItems="justify"
            overflow="hidden"
          >
            <Box px={1} bgColor="gray.100">
              <AssetTotalValue label="Trả" asset={withdrawal} />
            </Box>
            <Box h={0} flex={1} px={1} overflowY="auto" pb={10}>
              {suggestions.length === 0 && (
                <WithdrawSuggestion
                  asset={newAsset()}
                  withdrawal={withdrawal}
                  total={getTotalBalance(deposit) - total}
                />
              )}
              {suggestions.map((asset, index) => (
                <WithdrawSuggestion
                  key={index}
                  withdrawal={withdrawal}
                  total={getTotalBalance(deposit) - total}
                  asset={asset}
                  onClick={onApplySuggestion}
                />
              ))}
            </Box>
          </Flex>
        </Box>
        <Box px={1} pl={2} w={72}>
          <Flex
            h="100%"
            direction="column"
            rounded="lg"
            shadow="base"
            overflowY="hidden"
          >
            <Box px={1} bgColor="gray.100">
              <AssetTotalValue label="Nhận" asset={deposit} />
            </Box>
            <Flex
              h={0}
              flex={1}
              wrap="wrap"
              alignContent="flex-start"
              px={1}
              pb={10}
              overflowY="auto"
            >
              <AssetView current={deposit} asset={newAsset()} />
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex alignItems="baseline" justify="stretch">
        <Box w={0} flex={1} textColor="gray.500">
          <span>Thực tế/tổng tiền</span>
        </Box>
        <Box
          flex={1}
          fontSize="lg"
          fontWeight="bold"
          textAlign="right"
          textColor="gray.700"
        >
          {numeral(balance).format("0,0$")} / {numeral(total).format("0,0 $")}
        </Box>
      </Flex>
      <Flex alignItems="stretch">
        <Box w={0} flex={1}>
          <Button w="100%" onClick={onReset}>
            Cancel
          </Button>
        </Box>
        <Box pl={1} w={72}>
          <Button
            w="100%"
            onClick={onConfirm}
            colorScheme={balance === total ? "green" : undefined}
          >
            Confirm
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export const DrawerTransaction = ({ orders: selectedOrder }: Props) => {
  const [
    editingTransaction,
    setEditingTransaction,
  ] = React.useState<Transaction>();
  const [suggestions, setSuggestions] = React.useState<Asset[]>([]);
  const {
    draftTransactions,
    setDraftTransactions,
    drawer,
    setTransactions,
    orders,
    setOrders,
  } = React.useContext(TransactionContext);
  const asset: Asset = React.useMemo(() => editingTransaction ?? newAsset(), [
    editingTransaction,
  ]);
  const total = React.useMemo(() => {
    return selectedOrder.reduce(
      (total: number, order) => total + order.total,
      0
    );
  }, [selectedOrder]);
  const balance = React.useMemo(() => getTotalBalance(asset), [asset]);
  const stateRef = React.useRef<number>();
  const predictedDrawer = React.useMemo(
    () => addAsset(drawer ?? newAsset(), asset),
    [asset, drawer]
  );

  const updateAsset = React.useCallback(
    (asset: Asset) => {
      if (editingTransaction == null) {
        const transaction: Transaction = {
          orders: [...selectedOrder],
          status: TransactionStatus.DRAFT,
          type: TransactionType.ORDER,
          id: v4(),
          ...asset,
          createdAt: new Date(),
        };
        setDraftTransactions((transactions) => ({
          ...transactions,
          [transaction.id]: transaction,
        }));
        return;
      }
      setDraftTransactions((transactions) => ({
        ...transactions,
        [editingTransaction.id]: { ...editingTransaction, ...asset },
      }));
    },
    [setDraftTransactions, selectedOrder, editingTransaction]
  );

  const handleUp = React.useCallback(
    (cash: Cash) => {
      const newAsset = { ...asset, [cash]: asset[cash] + 1 };
      updateAsset(newAsset);
    },
    [asset, updateAsset]
  );
  const handleDown = React.useCallback(
    (cash: Cash) => {
      if (drawer == null || drawer[cash] + asset[cash] === 0) return;
      const newAsset = {
        ...asset,
        [cash]: asset[cash] - 1,
      };
      updateAsset(newAsset);
    },
    [asset, drawer, updateAsset]
  );

  const handleFoundSuggestions = React.useCallback(
    (ref: number, suggestions: PriorityQueue<Asset>) => {
      if (ref !== stateRef.current) {
        return false;
      }
      const suggestionArray: Asset[] = [];
      while (!suggestions.isEmpty()) {
        const suggestion = suggestions.pop();
        suggestionArray.push(suggestion);
      }
      setSuggestions(suggestionArray.reverse());
      return true;
    },
    []
  );

  React.useEffect(() => {
    const suggestionRef = new Date().getTime();
    stateRef.current = suggestionRef;
    if (balance <= total) {
      setSuggestions([]);
      return;
    }
    const onFound = (suggestions: PriorityQueue<Asset>) => {
      return handleFoundSuggestions(suggestionRef, suggestions);
    };
    suggestAsset(balance - total, predictedDrawer, onFound, 3);
  }, [balance, total, asset, handleFoundSuggestions, predictedDrawer]);

  const handleApplySuggestion = React.useCallback(
    (repay: Asset, _requestMore: number) => {
      const newAsset = Object.values(Cash).reduce((sum: Asset, cash) => {
        return { ...sum, [cash]: sum[cash] - repay[cash] };
      }, asset);
      updateAsset(newAsset);
    },
    [asset, updateAsset]
  );
  const handleReset = React.useCallback(() => {
    updateAsset(newAsset());
  }, [updateAsset]);
  const handleConfirm = React.useCallback(() => {
    if (editingTransaction == null) return;
    const newTx = {
      ...editingTransaction,
      createdAt: new Date(),
      status: TransactionStatus.PENDING,
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
    setDraftTransactions(newTxs);
    setTransactions((txs) => ({ ...txs, [newTx.id]: newTx }));
    const newOrders = orders?.map((order) => {
      if (editingTransaction.orders == null) {
        return order;
      }
      const has =
        editingTransaction.orders.filter(
          (editingOrder) => editingOrder.localId === order.localId
        ).length > 0;
      if (has) return { ...order, status: OrderStatus.PENDING };
      return order;
    });
    setOrders(newOrders);
  }, [
    editingTransaction,
    setTransactions,
    draftTransactions,
    setDraftTransactions,
    orders,
    setOrders,
  ]);

  React.useEffect(() => {
    const existTx = Object.values(draftTransactions).filter((tx) => {
      if (
        tx.orders == null ||
        tx.status !== TransactionStatus.DRAFT ||
        selectedOrder.length === 0
      )
        return false;
      const txOrderIDs = tx.orders.map((order) => order.localId).sort();
      const selectedOrderIDs = selectedOrder
        .map((order) => order.localId)
        .sort();
      if (txOrderIDs.length !== selectedOrderIDs.length) return false;
      for (let index = 0; index < txOrderIDs.length; index++) {
        if (txOrderIDs[index] !== selectedOrderIDs[index]) return false;
      }
      return true;
    });
    setEditingTransaction(existTx.length > 0 ? existTx[0] : undefined);
  }, [selectedOrder, draftTransactions]);
  return (
    <>
      <DrawerTransactionView
        drawer={drawer ?? newAsset()}
        total={total}
        onUp={handleUp}
        onDown={handleDown}
        suggestions={suggestions}
        onApplySuggestion={handleApplySuggestion}
        asset={asset}
        onReset={handleReset}
        onConfirm={handleConfirm}
      />
    </>
  );
};
