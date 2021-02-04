import React from "react";
import { CashImages } from "resources/transaction/transaction";
import { Box } from "@chakra-ui/react";
import { CashViewProps } from "./CashView";

const STACK_THRESH_HOLD = 4;
export const FullCashView = (props: CashViewProps) => {
  const renderCashes = () => {
    const components: React.ReactNode[] = [];
    for (let index = 0; index < props.count; index++) {
      components.push(
        <StackedCashView {...props} key={`${props.cash}-${index}`} count={1} />
      );
    }
    return components;
  };
  if (props.count > STACK_THRESH_HOLD) return <StackedCashView {...props} />;
  return <>{renderCashes()}</>;
};
export const StackedCashView = ({ cash, count, active }: CashViewProps) => {
  if (count === 0) return <></>;
  return (
    <Box
      m={1}
      fontWeight="extrabold"
      w={28}
      h={16}
      rounded="lg"
      border="2px"
      borderColor={active ? "blue.500" : "gray.100"}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        inset={0}
        opacity={active ? undefined : 0.2}
        bgSize="cover"
        bgImage={CashImages[cash]}
        bgPosition="center"
        bgRepeat="no-repeat"
      />
      <Box
        position="absolute"
        inset={0}
        opacity={active ? 0.4 : 0.1}
        bgColor="black"
      />
      <Box
        position="absolute"
        top={1}
        left={1}
        as="span"
        rounded="base"
        color="gray.600"
        bgColor="gray.100"
        px={2}
      >
        {Math.abs(count)}
      </Box>
    </Box>
  );
};
