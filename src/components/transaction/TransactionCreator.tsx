import React from "react";
import { DrawerTransaction } from "components/asset/DrawerTransaction";
import { Order, OrderStatus } from "resources/order";
import { useOrderGenerator } from "components/order/useOrderGenerator";
import { OrderMultipleSelect } from "components/order/OrderMultipleSelect";
import { TransactionContext } from "components/transaction/TransactionContext";
import { DrawerReset } from "components/drawer/DrawerSetter";
import { Box, Center, Flex } from "@chakra-ui/react";
import { TransactionProvider } from "./TransactionProvider";

const TransactionContextConsumer = () => {
  useOrderGenerator({
    timeout: 5000,
    maxOrderCount: 20,
    itemCountRange: [1, 4],
    quantityRange: [1, 10],
  });
  const { orders, drawer } = React.useContext(TransactionContext);
  const [selectedOrders, setSelectedOrders] = React.useState<Order[]>([]);
  const handleSelectOrder = React.useCallback(
    (order: Order) => {
      const active =
        selectedOrders.filter(
          (selecting) => selecting.localId === order.localId
        ).length > 0;
      if (active) {
        setSelectedOrders(
          selectedOrders.filter(
            (selecting) => selecting.localId !== order.localId
          )
        );
        return;
      }
      setSelectedOrders([...selectedOrders, order]);
    },
    [selectedOrders, setSelectedOrders]
  );
  React.useEffect(() => {
    setSelectedOrders((selectedOrders) => {
      const filtered = selectedOrders.filter(
        (selectedOrder) =>
          orders.filter(
            (order) =>
              order.status === OrderStatus.DRAFT &&
              order.localId === selectedOrder.localId
          ).length > 0
      );
      return filtered;
    });
  }, [orders]);

  return (
    <Flex h="100%" overflow="hidden">
      <Box w={80} h="100%">
        <Box
          textAlign="center"
          fontSize="2xl"
          fontWeight="bold"
          textColor="blue.700"
          mb={2}
        >
          Đơn hàng
        </Box>
        <OrderMultipleSelect
          orders={orders}
          selected={selectedOrders}
          onClick={handleSelectOrder}
        />
      </Box>
      <Box w={0} h="100%" flex={1} pl={4}>
        {drawer == null && <DrawerReset />}
        {drawer != null && selectedOrders.length !== 0 ? (
          <DrawerTransaction orders={selectedOrders} />
        ) : (
          <Center h="100%" fontWeight="bold">
            Vui lòng chọn đơn hàng để thực hiện thanh toán
          </Center>
        )}
      </Box>
    </Flex>
  );
};

const Page = () => (
  <TransactionProvider>
    <TransactionContextConsumer />
  </TransactionProvider>
);
export default Page;
