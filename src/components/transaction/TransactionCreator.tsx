import React from "react";
import { DrawerTransaction } from "components/asset/DrawerTransaction";
import { Order } from "resources/order";
import { useOrderGenerator } from "components/order/useOrderGenerator";
import { OrderMultipleSelect } from "components/order/OrderMultipleSelect";
import { TransactionContext } from "components/transaction/TransactionContext";
import { DrawerReset } from "components/drawer/DrawerSetter";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { TransactionProvider } from "./TransactionProvider";
import { getTotalBalance } from "resources/transaction/transaction";
import { useRouter } from "next/dist/client/router";
import { HamburgerIcon } from "@chakra-ui/icons";
interface DrawerProps {
  orders: Order[];
  selectedOrders: Order[];
  onOrderSelect: (order: Order) => void;
}
const SelectOrderDrawer = (props: DrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <Button
        ml={6}
        colorScheme="teal"
        leftIcon={<HamburgerIcon />}
        onClick={handleOpen}
      >
        Chọn đơn hàng ({props.selectedOrders.length}/{props.orders.length})
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={handleClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              Đơn hàng{" "}
              {props.orders.length > 0 ? `(${props.orders.length})` : ""}
            </DrawerHeader>
            <DrawerBody>
              <OrderMultipleSelect
                orders={props.orders}
                selected={props.selectedOrders}
                onClick={props.onOrderSelect}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

const TransactionContextConsumer = () => {
  useOrderGenerator({
    timeout: 5000,
    maxOrderCount: 20,
    itemCountRange: [1, 4],
    quantityRange: [1, 10],
  });
  const toast = useToast();
  const router = useRouter();
  const toastIdRef = React.useRef<any>();
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
              order.status === "draft" &&
              order.localId === selectedOrder.localId
          ).length > 0
      );
      return filtered;
    });
  }, [orders]);
  React.useEffect(() => {
    if (drawer != null && getTotalBalance(drawer) > 0) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      return;
    }
    toastIdRef.current = toast({
      title: "Tủ tiền của bạn đang trống",
      description: (
        <Box>
          <Box>
            Tủ tiền của bạn đang trống nên bạn sẽ không thể trả tiền thừa cho
            khách!
          </Box>
          <Button textColor="orange.500" onClick={() => router.push("/drawer")}>
            Thiết lập tủ tiền
          </Button>
        </Box>
      ),
      isClosable: true,
      status: "warning",
      duration: null,
    });
  }, [drawer, toast, router]);

  return (
    <Flex h="100%" direction="column">
      <Box display={{ base: "block", md: "none" }}>
        <SelectOrderDrawer
          orders={orders}
          selectedOrders={selectedOrders}
          onOrderSelect={handleSelectOrder}
        />
      </Box>
      <Flex flex={1} overflow="hidden">
        <Box display={{ base: "none", md: "block" }} w={80} h="100%">
          <Box
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            textColor="blue.700"
            mb={2}
          >
            Đơn hàng {orders.length > 0 ? `(${orders.length})` : ""}
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
            <Box ml={2} h="100%" fontWeight="bold">
              Vui lòng chọn đơn hàng để thực hiện thanh toán. Bạn chưa chọn đơn
              hàng để tạo giao dịch.
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

const Page = () => (
  <TransactionProvider>
    <TransactionContextConsumer />
  </TransactionProvider>
);
export default Page;
