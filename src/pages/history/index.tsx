import * as React from "react";
import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("components/transaction/HistoryPage"), {
  ssr: false,
});

const ImagePage: React.FC = () => {
  return <NoSSR />;
};

export default ImagePage;
