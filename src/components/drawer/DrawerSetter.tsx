import React from "react";
import { Cash, Drawer, newAsset } from "resources/transaction/transaction";
import { AssetPicker } from "../asset/AssetPicker";
import { TransactionContext } from "components/transaction/TransactionContext";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { v4 } from "uuid";

export const DrawerReset = () => {
  const [drawer, setDrawer] = React.useState<Drawer>(newAsset());
  const { onAddTransaction } = React.useContext(TransactionContext);
  const renderAssetTypeExtra = (cash: Cash) => (
    <Flex justify="space-between">
      <Box
        px={2}
        fontWeight="bold"
        color="gray.100"
        bgColor="gray.700"
        rounded="full"
      >
        {drawer[cash]}
      </Box>
    </Flex>
  );
  const handleUp = React.useCallback((cash: Cash) => {
    setDrawer((drawer) => ({ ...drawer, [cash]: drawer[cash] + 1 }));
  }, []);
  const handleDown = React.useCallback(
    (cash: Cash) => {
      if (drawer[cash] === 0) return;
      setDrawer({ ...drawer, [cash]: drawer[cash] - 1 });
    },
    [drawer]
  );
  const handleConfirm = React.useCallback(() => {
    onAddTransaction({
      ...drawer,
      type: "reset",
      status: "pending",
      id: v4(),
      createdAt: new Date(),
    });
  }, [drawer, onAddTransaction]);
  return (
    <Flex direction="column" alignItems="center" h="100%" textColor="gray.500">
      <Heading mb={8}>Thiết lập tủ tiền</Heading>
      <Box w="100%">
        <AssetPicker
          asset={drawer}
          onUp={handleUp}
          onDown={handleDown}
          renderAssetTypeExtra={renderAssetTypeExtra}
        />
      </Box>
      <Center flex={1} px={20} textColor="gray.500">
        <Box>
          <p>
            Bạn đang làm việc offline vì chúng tôi không thể kết nối với máy chủ
          </p>
          <p>
            Hãy tiếp tục thiết lập số tiền trong tủ để có thể tiếp tục làm việc
            nhé
          </p>
        </Box>
      </Center>
      <Button w="100%" onClick={handleConfirm}>
        Confirm
      </Button>
    </Flex>
  );
};
