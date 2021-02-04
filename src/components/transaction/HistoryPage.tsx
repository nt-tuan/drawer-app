import * as React from "react";
import { Accordion, Center } from "@chakra-ui/react";
import { TransactionContext } from "components/transaction/TransactionContext";
import { TransactionProvider } from "components/transaction/TransactionProvider";
import { TransactionStatus } from "resources/transaction/transaction";
import { TransactionCard } from "components/transaction/TransactionCard";
const TransactionHistoryConsumer = () => {
  const { transactions: set } = React.useContext(TransactionContext);
  const transactions = Object.values(set).filter(
    (tx) => tx.status !== TransactionStatus.DRAFT
  );
  return (
    <Accordion allowMultiple>
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
      {transactions.length === 0 && (
        <Center h="100%">Không có lịch sử giao dịch</Center>
      )}
    </Accordion>
  );
};
const Page = () => (
  <TransactionProvider>
    <TransactionHistoryConsumer />
  </TransactionProvider>
);
export default Page;
