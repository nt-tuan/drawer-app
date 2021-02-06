import React from "react";
import numeral from "numeral";
import { CashViewProps } from "./CashView";
import { Box, Flex, WrapItem } from "@chakra-ui/react";

export const MinimalCashView = ({
  cash,
  count,
  active,
  colorScheme,
}: CashViewProps) => {
  const color500 = (colorScheme ?? "gray") + ".500";
  const color100 = (colorScheme ?? "gray") + ".100";
  if (count === 0) return <></>;
  return (
    <WrapItem key={cash}>
      <Flex
        border="2px"
        rounded="base"
        borderColor={color500}
        opacity={active ? 1 : 0.4}
        alignItems="stretch"
      >
        <Box as="span" px={2} color={color500}>
          {numeral(cash.toString().replace(/[^0..9]/, "")).format("(0a)")}
        </Box>
        <Box bgColor={color500} color={color100} as="span" px={1}>
          &times;{count}
        </Box>
      </Flex>
    </WrapItem>
  );
};
