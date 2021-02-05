import React from "react";
import { Asset, Cash } from "resources/transaction/transaction";
import { CashViewWrapItem } from "components/cash/CashView";
import { Wrap } from "@chakra-ui/react";

interface Props {
  asset: Asset;
  current?: Asset;
  negativeColorScheme: "red" | "blue" | "green";
  positiveColorScheme: "red" | "blue" | "green";
  stackThreshold: number;
}

export const AssetView = ({
  asset,
  current,
  negativeColorScheme,
  positiveColorScheme,
  stackThreshold,
}: Props) => {
  return (
    <Wrap>
      {current &&
        Object.values(Cash).map((value) =>
          current[value] ? (
            <CashViewWrapItem
              stackThreshold={stackThreshold}
              key={`active-${value}`}
              active={true}
              colorScheme={
                current[value] > 0 ? positiveColorScheme : negativeColorScheme
              }
              cash={value}
              count={current[value]}
            />
          ) : (
            <></>
          )
        )}
      {Object.values(Cash).map((value) =>
        asset[value] ? (
          <CashViewWrapItem
            stackThreshold={stackThreshold}
            key={value}
            active={false}
            colorScheme={
              asset[value] > 0 ? positiveColorScheme : negativeColorScheme
            }
            cash={value}
            count={asset[value]}
          />
        ) : (
          <></>
        )
      )}
    </Wrap>
  );
};
