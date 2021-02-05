import {
  Box,
  Flex,
  Button,
  Grid,
  MenuButton,
  Menu,
  MenuList,
  MenuItem as CKMenuItem,
  Switch,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { useCashViewType } from "components/cash/CashView";
const MenuItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link href={href}>
      <Button
        pt={4}
        pb={2}
        variant="link"
        textColor={active ? "blue.700" : "gray.700"}
        borderBottom="2px"
        borderBottomColor={active ? "blue.500" : "gray.100"}
        rounded="none"
      >
        {children}
      </Button>
    </Link>
  );
};
export const NavBar = () => {
  const [viewType, setViewType] = useCashViewType();
  const handleToggleViewType = React.useCallback(() => {
    if (viewType === "full") setViewType("minimal");
    else setViewType("full");
  }, [viewType, setViewType]);
  return (
    <Flex bgColor="gray.100" mb={4}>
      <Grid
        w={0}
        flex={1}
        templateColumns="repeat(3, 1fr)"
        justify="space-between"
      >
        <MenuItem href="/">Transactions</MenuItem>
        <MenuItem href="/history">History</MenuItem>
        <MenuItem href="/drawer">Reset Drawer</MenuItem>
      </Grid>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          mx={4}
          variant="link"
          color="gray.700"
          rightIcon={<ChevronDownIcon />}
        >
          <SettingsIcon />
        </MenuButton>
        <MenuList bgColor="white">
          <CKMenuItem>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="cash-view-type" mb="0">
                Hiển thị tiền thu gọn
              </FormLabel>
              <Switch
                id="cash-view-type"
                checked={viewType === "full"}
                onChange={handleToggleViewType}
              />
            </FormControl>
          </CKMenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
