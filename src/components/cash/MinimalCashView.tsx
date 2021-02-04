import React from "react";
import numeral from "numeral";
import { CashViewProps } from "./CashView";
import { Box } from "@chakra-ui/react";

export const MinimalCashView = ({ cash, count, active }: CashViewProps) => {
  return (
    <Box opacity={active ? 1 : 0.4}>
      {count}{" "}
      <span>
        {numeral(cash.toString().replace(/[^0..9]/, "")).format("0 a")}
      </span>
    </Box>
  );
};
