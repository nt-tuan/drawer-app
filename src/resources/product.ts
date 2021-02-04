import api from "./api";
import ptmAPI from "./ptm";
import { Category } from "./category";
import ptm from "./ptm";

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
  category: Category;
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

export async function loadProduct(slug: string) {
  return api.get<Product>(`/product?slug=${slug}`);
}

export async function loadProducts() {
  // await new Promise(resolve => setTimeout(resolve, 5000));
  return api.get<Product[]>("/product/all");
}

export async function loadCollections() {
  return api.get<ProductCollection[]>("/product/collection/all");
}

export async function loadCollectionsByIds(ids: number[]) {
  return api.get<ProductCollection[]>(
    `/product/collection?ids=${ids.join(",")}`
  );
}

export async function createPreviewProduct(product: Product) {
  return ptmAPI.post("/product", "", JSON.stringify(product));
}
