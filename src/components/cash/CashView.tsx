import React from "react";
import { Cash } from "resources/transaction/transaction";
import useLocalStorage from "@rehooks/local-storage";
import { FullCashView } from "./FullCashView";
import { MinimalCashView } from "./MinimalCashView";
import { Box } from "@chakra-ui/react";

const CASH_VIEW_TYPE_KEY = "cashViewType";
type CashViewType = "full" | "minimal";
export const useCashViewType = (): [
  CashViewType,
  (type: CashViewType) => void
] => {
  const [cashViewType, set] = useLocalStorage(CASH_VIEW_TYPE_KEY, "full");
  const viewType: CashViewType = React.useMemo(
    () =>
      cashViewType == null || cashViewType === "full" ? "full" : "minimal",
    [cashViewType]
  );
  const setViewType = (type: CashViewType) => {
    set(type);
  };
  return [viewType, setViewType];
};
export interface CashViewProps {
  colorScheme?: "red" | "green" | "blue";
  cash: Cash;
  count: number;
  active?: boolean;
  stackThreshold: number;
}
export const CashViewWrapItem = (props: CashViewProps) => {
  const [cashViewType] = useCashViewType();
  if (props.count === 0) return <></>;
  return cashViewType === "full" ? (
    <FullCashView {...props} />
  ) : (
    <MinimalCashView {...props} />
  );
};
