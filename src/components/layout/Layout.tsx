import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";

const NavBarNoSSR = dynamic<{}>(
  () => import("components/layout/NavBar").then((m) => m.NavBar),
  {
    ssr: false,
  }
);
export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Flex direction="column" h="100%" pb={2}>
      <NavBarNoSSR />
      <Box h={0} flex={1}>
        {children}
      </Box>
    </Flex>
  );
};
