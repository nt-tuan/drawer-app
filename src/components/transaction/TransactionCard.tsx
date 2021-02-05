import { OrderCard } from "components/order/OrderMultipleSelect";
import React from "react";
import numeral from "numeral";
import {
  getTotalBalance,
  newAsset,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "resources/transaction/transaction";
import { AssetView } from "components/asset/AssetView";
import {
  Box,
  Flex,
  HStack,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { TransactionContext } from "./TransactionContext";

interface Props {
  transaction: Transaction;
}
const TransactionStatusTag = ({ status }: { status: TransactionStatus }) => {
  if (status === "pending")
    return (
      <Badge alignSelf="center" colorScheme="blue">
        pending
      </Badge>
    );
  if (status === "draft")
    return (
      <Badge alignSelf="center" colorScheme="gray">
        draft
      </Badge>
    );
  if (status === "committed")
    return (
      <Badge alignSelf="center" colorScheme="green">
        committed
      </Badge>
    );
  return <></>;
};
const TransactionTypeTag = ({ type }: { type: TransactionType }) => {
  if (type === "lending")
    return (
      <Box textColor="gray.700" fontWeight="bold">
        Lend
      </Box>
    );
  if (type === "order")
    return (
      <Box textColor="gray.700" fontWeight="bold">
        Cash
      </Box>
    );
  if (type === "reset")
    return (
      <Box textColor="gray.700" fontWeight="bold">
        Reset
      </Box>
    );
  if (type === "shipping")
    return (
      <Box textColor="gray.700" fontWeight="bold">
        Ship
      </Box>
    );
  return <></>;
};
export const TransactionCard = (props: Props) => {
  const { onTransactionDelete } = React.useContext(TransactionContext);
  return (
    <Box>
      <AccordionItem>
        <AccordionButton bgColor="gray.100" py={0}>
          <Box flex="1" textAlign="left">
            <Flex px={2} w="100%" justify="space-between" alignItems="baseline">
              <HStack spacing={4} alignItems="baseline" justify="stretch">
                <TransactionTypeTag type={props.transaction.type} />
                <Box overflow="hidden" fontSize="xs" textColor="gray.500">
                  {new Date(props.transaction.createdAt).toLocaleString("vi")}
                </Box>
                <TransactionStatusTag status={props.transaction.status} />
              </HStack>
              <Box
                fontSize="lg"
                fontWeight="bold"
                textAlign="right"
                textColor="gray.700"
                as="span"
              >
                {numeral(getTotalBalance(props.transaction)).format("0,0 $")}
              </Box>
            </Flex>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box p={1}>
            <HStack spacing={2} pb={4} justify="flex-end">
              <IconButton
                icon={<DeleteIcon />}
                aria-label="delete"
                onClick={() => onTransactionDelete(props.transaction)}
              />
            </HStack>

            <AssetView
              stackThreshold={1}
              negativeColorScheme="red"
              positiveColorScheme="green"
              current={props.transaction}
              asset={newAsset()}
            />

            {props.transaction.orders != null &&
              props.transaction.orders.length > 0 && (
                <Flex p={1} wrap="wrap" alignItems="stretch">
                  {props.transaction.orders.map((order, index) => (
                    <OrderCard key={index} onClick={() => {}} order={order} />
                  ))}
                </Flex>
              )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};
