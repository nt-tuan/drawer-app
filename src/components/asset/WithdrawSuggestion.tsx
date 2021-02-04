import React from "react";
import { Asset, getTotalBalance } from "resources/transaction/transaction";
import { AssetView } from "./AssetView";
import numeral from "numeral";
import { Box, Flex } from "@chakra-ui/react";
interface Props {
  asset: Asset;
  withdrawal: Asset;
  total: number;
  onClick?: (asset: Asset, requestMore: number) => void;
}
const WithdrawSuggestionContent = ({ asset, withdrawal, total }: Props) => {
  const requestMoreAmount = getTotalBalance(asset) - total;
  return (
    <Box w="100%">
      {requestMoreAmount > 0 && (
        <Box px={2} textColor="yellow.700" bgColor="yellow.100">
          Mình hỏi khách có{" "}
          <Box as="span" px={2} fontWeight="bold" textColor="blue.500">
            {numeral(requestMoreAmount).format("0,0 $")}
          </Box>
          không
        </Box>
      )}
      <Flex wrap="wrap">
        <AssetView asset={asset} current={withdrawal} />
      </Flex>
    </Box>
  );
};

export const WithdrawSuggestion = (props: Props) => {
  return (
    <Box py={1}>
      <Box
        rounded="lg"
        shadow="base"
        bgColor="white"
        border="1px"
        borderColor="gray.300"
        overflow="hidden"
        cursor={props.onClick ? "pointer" : undefined}
        _hover={{
          bgColor: props.onClick ? "gray.50" : undefined,
        }}
        onClick={() => props.onClick && props.onClick(props.asset, 0)}
      >
        <WithdrawSuggestionContent {...props} />
      </Box>
    </Box>
  );
};
