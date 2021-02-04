import React from "react";
import { Asset, Cash } from "resources/transaction/transaction";
import { CashView } from "components/cash/CashView";

interface Props {
  asset: Asset;
  current?: Asset;
}
export const AssetView = ({ asset, current }: Props) => {
  return (
    <>
      {current &&
        Object.values(Cash).map((value) => (
          <CashView
            key={`active-${value}`}
            active={true}
            cash={value}
            count={current[value]}
          />
        ))}
      {Object.values(Cash).map((value) => (
        <CashView
          active={false}
          key={value}
          cash={value}
          count={asset[value]}
        />
      ))}
    </>
  );
};
