import React from "react";
import { Cash, Asset, CashImages } from "resources/transaction/transaction";
import { Box, Flex, GridItem, Grid, Center } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
export type Intent = "red" | "blue" | "yellow";
const HoverComponent = ({ children }: { children: React.ReactNode }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Box
      w="100%"
      h="100%"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? children : <></>}
    </Box>
  );
};

interface AssetTypeProps {
  cash: Cash;
  count: number;
  intent?: Intent;
  renderExtras?: (cash: Cash) => React.ReactNode;
  onUp: (cash: Cash) => void;
  onDown: (cash: Cash) => void;
}
const borderColor = (color: "red" | "yellow" | "blue" | undefined) => {
  if (color === "red") return "red.500";
  if (color === "yellow") return "yellow.500";
  if (color === "blue") return "blue.500";
  if (color === undefined) return "gray.200";
};
const CashButton = ({
  cash,
  count,
  intent,
  renderExtras,
  onDown,
  onUp,
}: AssetTypeProps) => {
  return (
    <Box pt={2} h={20}>
      <Box
        position="relative"
        w="100%"
        h="100%"
        shadow="lg"
        bgColor="gray.300"
        rounded="lg"
        overflow="hidden"
        role="group"
      >
        <Box
          position="absolute"
          inset={0}
          bgRepeat="no-repeat"
          rounded="lg"
          opacity={0.75}
          _groupHover={{
            opacity: 0.2,
          }}
          backgroundImage={CashImages[cash]}
          backgroundSize="cover"
          backgroundPosition="center"
        />
        <Box
          position="absolute"
          inset={0}
          bgRepeat="no-repeat"
          rounded="lg"
          opacity={0.5}
          _groupHover={{
            opacity: 0.25,
          }}
          backgroundColor="black"
          backgroundSize="cover"
          backgroundPosition="center"
        />
        <Box
          position="absolute"
          inset={0}
          border="2px"
          rounded="lg"
          borderColor={borderColor(intent)}
        />

        <Box position="absolute" inset={0}>
          <Flex w="100%" h="100%">
            <Box w="50%" h="100%" cursor="pointer" onClick={() => onDown(cash)}>
              <HoverComponent>
                <Box w="100%" h="100%" position="relative">
                  <Box
                    position="absolute"
                    inset={0}
                    backgroundColor="red.500"
                    opacity={0.25}
                  />
                  <Center h="100%" w="100%">
                    <TriangleDownIcon textColor="red.500" boxSize="12" />
                  </Center>
                </Box>
              </HoverComponent>
            </Box>
            <Box w="50%" h="100%" cursor="pointer" onClick={() => onUp(cash)}>
              <HoverComponent>
                <Box w="100%" h="100%" position="relative">
                  <Box
                    position="absolute"
                    inset={0}
                    backgroundColor="green.500"
                    opacity={0.25}
                  />
                  <Center position="absolute" inset={0}>
                    <TriangleUpIcon boxSize="12" textColor="green.500" />
                  </Center>
                </Box>
              </HoverComponent>
            </Box>
          </Flex>
        </Box>
        <Box position="absolute">
          <Flex direction="row" m={1}>
            {renderExtras && renderExtras(cash)}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

interface Props {
  asset: Asset;
  getIntent?: (cash: Cash) => Intent | undefined;
  renderExtras?: () => React.ReactNode;
  renderAssetTypeExtra?: (cash: Cash) => React.ReactNode;
  onUp: (cash: Cash) => void;
  onDown: (cash: Cash) => void;
}

export const AssetPicker = ({
  asset,
  getIntent,
  onUp,
  onDown,
  renderExtras,
  renderAssetTypeExtra,
}: Props) => {
  const renderCashButton = React.useCallback(
    (cash: Cash) => (
      <CashButton
        key={cash}
        intent={getIntent ? getIntent(cash) : undefined}
        count={asset[cash]}
        cash={cash}
        renderExtras={renderAssetTypeExtra}
        onUp={onUp}
        onDown={onDown}
      />
    ),
    [renderAssetTypeExtra, onUp, onDown, getIntent, asset]
  );
  return (
    <Grid
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={1}
    >
      {Object.values(Cash).map((cash, index) => (
        <GridItem key={index} rowSpan={1} col={1}>
          {renderCashButton(cash)}
        </GridItem>
      ))}
    </Grid>
  );
};
