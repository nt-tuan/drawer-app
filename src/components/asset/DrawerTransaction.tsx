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
} from "resources/transaction/transaction";
import { AssetPicker } from "./AssetPicker";
import { AssetView } from "./AssetView";
import { suggestAsset } from "common/suggestAsset";
import { PriorityQueue } from "common/PriorityQueue";
import { WithdrawSuggestion } from "./WithdrawSuggestion";
import numeral from "numeral";
import { Order } from "resources/order";
import { TransactionContext } from "components/transaction/TransactionContext";
import { v4 } from "uuid";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";

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
  onShip: () => void;
  onLend: () => void;
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
  ...props
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
          onUp={props.onUp}
          onDown={props.onDown}
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
            <Box px={2} mb={4} bgColor="gray.100">
              <AssetTotalValue label="Trả" asset={withdrawal} />
            </Box>
            <VStack
              h={0}
              flex={1}
              overflowY="auto"
              pb={10}
              px={2}
              alignItems="stretch"
            >
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
                  onClick={props.onApplySuggestion}
                />
              ))}
            </VStack>
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
            <Box px={2} bgColor="gray.100" mb={4}>
              <AssetTotalValue label="Nhận" asset={deposit} />
            </Box>
            <Box px={2}>
              <AssetView
                stackThreshold={4}
                positiveColorScheme="green"
                negativeColorScheme="red"
                current={deposit}
                asset={newAsset()}
              />
            </Box>
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
          <Button w="100%" onClick={props.onReset}>
            Hủy
          </Button>
        </Box>
        <Box pl={1}>
          <Button w="100%" onClick={props.onLend}>
            Ghi nợ
          </Button>
        </Box>
        <Box pl={1}>
          <Button w="100%" onClick={props.onShip}>
            Ship/Thu hộ
          </Button>
        </Box>
        <Box pl={1} w={72}>
          <Button
            w="100%"
            onClick={props.onConfirm}
            colorScheme={balance === total ? "green" : undefined}
          >
            Xác nhận
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
    onAddTransaction,
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
          status: "draft",
          type: "order",
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
    const newTx: Transaction = {
      ...editingTransaction,
      createdAt: new Date(),
      status: "pending",
    };
    onAddTransaction(newTx);
  }, [editingTransaction, onAddTransaction]);
  const handleLend = React.useCallback(() => {
    if (selectedOrder == null || selectedOrder.length === 0) return;
    const newTx: Transaction = {
      orders: selectedOrder,
      createdAt: new Date(),
      status: "pending",
      type: "lending",
      id: v4(),
      ...newAsset(),
    };
    onAddTransaction(newTx);
  }, [onAddTransaction, selectedOrder]);
  const handleShip = React.useCallback(() => {
    if (selectedOrder == null || selectedOrder.length === 0) return;
    const newTx: Transaction = {
      orders: selectedOrder,
      createdAt: new Date(),
      status: "pending",
      type: "shipping",
      id: v4(),
      ...newAsset(),
    };
    onAddTransaction(newTx);
  }, [onAddTransaction, selectedOrder]);
  React.useEffect(() => {
    const existTx = Object.values(draftTransactions).filter((tx) => {
      if (
        tx.orders == null ||
        tx.status !== "draft" ||
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
        onLend={handleLend}
        onShip={handleShip}
      />
    </>
  );
};
