import { OrderCard } from "components/order/OrderMultipleSelect";
import React from "react";
import numeral from "numeral";
import {
  getTotalBalance,
  multipleAsset,
  newAsset,
  Transaction,
  TransactionStatus,
} from "resources/transaction/transaction";
import { AssetView } from "components/asset/AssetView";
import {
  Box,
  Center,
  Flex,
  HStack,
  Tag,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";

interface Props {
  transaction: Transaction;
}
export const TransactionCard = (props: Props) => {
  const { negativeAsset, negativeTotal } = React.useMemo(() => {
    const negativeAsset = multipleAsset(props.transaction, -1);
    const negativeTotal = getTotalBalance(
      props.transaction,
      (_, value) => value < 0
    );
    return { negativeAsset, negativeTotal };
  }, [props]);
  return (
    <AccordionItem>
      <AccordionButton bgColor="gray.100">
        <Box flex="1" textAlign="left">
          <Flex p={2} w="100%" justify="space-between">
            <HStack>
              <Box overflow="hidden" text="base" textColor="gray.500">
                {props.transaction.id}
              </Box>
              {props.transaction.status === TransactionStatus.PENDING && (
                <Tag colorScheme="blue">pending</Tag>
              )}
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
        <Box p={1} rounded="base" shadow="base">
          <Flex p={1} wrap="wrap" alignItems="stretch">
            <Center>
              <TriangleUpIcon boxSize="24px" color="green" />
            </Center>
            <AssetView current={props.transaction} asset={newAsset()} />
          </Flex>
          {negativeTotal !== 0 && (
            <Flex p={1} wrap="wrap" alignItems="stretch">
              <Center>
                <TriangleDownIcon boxSize="24px" color="red" />
              </Center>
              <AssetView current={negativeAsset} asset={newAsset()} />
            </Flex>
          )}
          {(props.transaction.orders?.length ?? 0) > 0 && (
            <Flex p={1} wrap="wrap" alignItems="stretch">
              <Center>
                <TriangleDownIcon boxSize="24px" color="red" />
              </Center>
              {props.transaction.orders &&
                props.transaction.orders.map((order, index) => (
                  <OrderCard key={index} onClick={() => {}} order={order} />
                ))}
            </Flex>
          )}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
