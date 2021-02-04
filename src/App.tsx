import React from "react";
import { ProductList } from "./components/ProductList";
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
function App() {
  return (
    <div className="p-20 bg-gray-100">
      <ProductList />
    </div>
  );
}

export default App;
