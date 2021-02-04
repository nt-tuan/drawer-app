import React from "react";
import { Cash } from "resources/transaction/transaction";
import useLocalStorage from "@rehooks/local-storage";
import { FullCashView } from "./FullCashView";
import { MinimalCashView } from "./MinimalCashView";

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
  cash: Cash;
  count: number;
  active?: boolean;
}
export const CashView = (props: CashViewProps) => {
  const [cashViewType] = useCashViewType();
  if (cashViewType === "full") {
    return <FullCashView {...props} />;
  }
  return <MinimalCashView {...props} />;
};
