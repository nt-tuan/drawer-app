import { DrawerReset } from "components/drawer/DrawerSetter";
import { TransactionProvider } from "components/transaction/TransactionProvider";
import React from "react";

const Page = () => {
  return (
    <TransactionProvider>
      <DrawerReset />
    </TransactionProvider>
  );
};
export default Page;
