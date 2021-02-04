import * as React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Layout } from "components/layout/Layout";
import "../styles/index.css";
import numeral from "numeral";
if (numeral.locales["vi"] === undefined) {
  numeral.register("locale", "vi", {
    delimiters: {
      thousands: ".",
      decimal: ",",
    },
    abbreviations: {
      thousand: " nghìn",
      million: " triệu",
      billion: " tỷ",
      trillion: " nghìn tỷ",
    },
    ordinal: function () {
      return ".";
    },
    currency: {
      symbol: "₫",
    },
  });
}
numeral.locale("vi");
// 1. Using a style object
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
      },
    },
  },
});
const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <props.Component {...props.pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
