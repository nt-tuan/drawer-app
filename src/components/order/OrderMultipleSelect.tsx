import React from "react";
import { Order, OrderStatus } from "resources/order";
import numeral from "numeral";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
interface Props {
  orders: Order[];
  selected: Order[];
  onClick: (order: Order) => void;
}
export const OrderCard = ({
  order,
  active,
  onClick,
}: {
  order: Order;
  active?: boolean;
  onClick: (order: Order) => void;
}) => {
  return (
    <Box p={2} cursor="pointer">
      <Flex
        direction="column"
        textColor="gray.700"
        shadow="base"
        rounded="base"
        border="2px"
        borderColor={active ? "blue.500" : "gray.200"}
        onClick={() => onClick(order)}
      >
        <Flex
          justify="space-between"
          alignItems="baseline"
          p={1}
          bgColor={active ? "blue.100" : "gray.100"}
        >
          <Box w="50%" isTruncated>
            <Text as="span" mr={1} fontSize="base" fontWeight="bold">
              {order.user.name}
            </Text>
            <Text as="span" fontSize="xs" textColor="gray.500">
              {" "}
              {order.user.phone}
            </Text>
          </Box>
          <Box
            textAlign="right"
            isTruncated
            w="50%"
            as="span"
            fontSize="xl"
            fontWeight="bold"
          >
            {numeral(order.total).format("0,0 $")}
          </Box>
        </Flex>
        <VStack px={1} alignItems="stretch">
          {order.items.map((item, index) => (
            <Box key={index}>
              <Box>
                <Box as="span" className="text-base font-bold">
                  {item.quantity}
                </Box>{" "}
                &times;{" "}
                <Box as="span" className="text-sm font-bold text-gray-500">
                  {item.product.name}
                </Box>
              </Box>
              {item.product.options &&
                item.product.options.map((featureIndex) => (
                  <Box key={featureIndex}>
                    {item.product.features[featureIndex]}
                  </Box>
                ))}
            </Box>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};
export const OrderMultipleSelect = (props: Props) => {
  return (
    <Flex h="100%" direction="column">
      {props.selected.length > 0 && (
        <Box
          alignSelf="center"
          as="span"
          px={3}
          textColor="blue.100"
          bgColor="blue.500"
          mx={2}
          mb={2}
          rounded="full"
        >
          Đang chọn{" "}
          <Box as="span" fontWeight="bold">
            {props.selected.length}
          </Box>{" "}
          đơn hàng
        </Box>
      )}
      <VStack h={0} flex={1} alignItems="stretch" overflow="auto">
        {props.orders
          .filter((order) => order.status === OrderStatus.DRAFT)
          .map((order) => (
            <OrderCard
              order={order}
              key={order.localId}
              active={
                props.selected.filter(
                  (filtered) => filtered.localId === order.localId
                ).length > 0
              }
              onClick={props.onClick}
            />
          ))}
      </VStack>
    </Flex>
  );
};
