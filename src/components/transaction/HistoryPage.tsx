import * as React from "react";
import { Accordion, Box, Center, Flex, Heading } from "@chakra-ui/react";
import { TransactionContext } from "components/transaction/TransactionContext";
import { TransactionProvider } from "components/transaction/TransactionProvider";
import { newAsset } from "resources/transaction/transaction";
import { TransactionCard } from "components/transaction/TransactionCard";
import { AssetView } from "components/asset/AssetView";
const TransactionHistoryConsumer = () => {
  const { drawer, transactions: set } = React.useContext(TransactionContext);
  const transactions = Object.values(set).filter((tx) => tx.status !== "draft");
  return (
    <Box px={4}>
      <Heading mb={4} fontSize="2xl">
        Tủ tiền hiện tại
      </Heading>
      <Flex wrap="wrap" justify="center">
        <AssetView
          stackThreshold={1}
          positiveColorScheme="green"
          negativeColorScheme="red"
          current={drawer}
          asset={newAsset()}
        />
      </Flex>

      <Heading mt={6} mb={4} fontSize="2xl">
        Lịch sử giao dịch
      </Heading>
      <Accordion allowMultiple textColor="gray.500">
        {transactions.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}
        {transactions.length === 0 && (
          <Center h="100%">Không có lịch sử giao dịch</Center>
        )}
      </Accordion>
    </Box>
  );
};
const Page = () => (
  <TransactionProvider>
    <TransactionHistoryConsumer />
  </TransactionProvider>
);
export default Page;
