import api from "./api";

export enum Grind {
  BEAN = "bean",
  FILTER = "filter",
  ESPRESSO = "espresso",
}

export type Option = Grind;

export interface ProductFeature {
  id: number;
  slug: string;
  name: string;
  description: string;
  options: ProductOption[];
}

export interface ProductOption {
  id: number;
  slug: string;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  full_name: string;
  code: string;
  is_available: boolean;
  price: number;
  original_price: number;
  images: string[];
  unit: string;
  description: string;
  is_default: boolean;
  is_feature: boolean;
  features: ProductFeature[];
  children: Product[];
  options: number[];
  badges: ProductBadge[];
}

export interface ProductBadge {
  slug: string;
  description: string;
}

export interface ProductCollection {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export async function loadProducts() {
  // await new Promise(resolve => setTimeout(resolve, 5000));
  return api.get<Product[]>("/api/products");
}
