import { Box, Flex } from "@chakra-ui/react";
import React from "react";

const Page = () => {
  return (
    <Flex>
      <Box w={72}>Thông tin đơn hàng</Box>
      <Box flex={1}>Danh sách hàng hóa</Box>
    </Flex>
  );
};

export default Page;
