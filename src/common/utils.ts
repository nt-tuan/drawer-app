export enum PriceFormat {
  FULL = "full",
  SHORT = "short",
}

export function formatNumber(number: number) {
  return String(number)
    .split(/(\d{0,3})(\d{3})$/)
    .filter(Boolean)
    .join(".");
}

export function formatPercentage(value: number) {
  return `${Math.floor(value)}%`;
}

export function formatPrice(price: number, type = PriceFormat.FULL) {
  switch (type) {
    case PriceFormat.FULL:
      return `${formatNumber(price)}₫`;
    case PriceFormat.SHORT:
      return `${formatNumber(price / 1000)}k`;
  }
}
