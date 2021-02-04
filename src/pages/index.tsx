import React from "react";
import dynamic from "next/dynamic";
const PageNoSSR = dynamic(
  () => import("components/transaction/TransactionCreator"),
  {
    ssr: false,
  }
);

const ImagePage: React.FC = () => {
  return <PageNoSSR />;
};

export default ImagePage;
