import React from "react";
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
  return <></>;
}

export default App;
