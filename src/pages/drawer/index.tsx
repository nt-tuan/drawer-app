import React from "react";
import dynamic from "next/dynamic";
const NoSSR = dynamic(() => import("components/drawer/DrawerSetterPage"), {
  ssr: false,
});
const Page = () => {
  return <NoSSR />;
};
export default Page;
