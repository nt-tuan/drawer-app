import React from "react";
import { OrderItem as Props } from "resources/order";
import { Product } from "resources/product";

const getProductImage = (product: Product) => {
  return product.images.length ? product.images[0] : "Default Image";
};

export const OrderItem = ({ item }: { item: Props }) => {
  return (
    <div className="relative w-full h-32">
      <div className="absolute">
        <img
          className="w-full"
          src={getProductImage(item.product)}
          alt={item.product.full_name}
        />
      </div>
      <div>{item.quantity}</div>
    </div>
  );
};
