import React from "react";
import { Order, OrderItem } from "resources/order";
import { loadProducts, Product } from "resources/product";
import { v4 } from "uuid";
import { TransactionContext } from "components/transaction/TransactionContext";
import { useToast } from "@chakra-ui/react";
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const customerNames = ["Tuan", "Hrafn", "Honey", "Zibiah", "Kyros", "Slavitsa"];
const randomPhone = () => {
  let phone = "";
  for (let i = 0; i < 11; i++) {
    phone += randomInt(0, 9).toString();
  }
  return phone;
};
const randomOrder = (
  orderItemCountRange: [number, number],
  quantityPerProduct: [number, number],
  products: Product[]
): Order => {
  const orderItemCount = randomInt(
    orderItemCountRange[0],
    orderItemCountRange[1]
  );
  const items: OrderItem[] = [];
  for (let index = 0; index < orderItemCount; index++) {
    const quantity = randomInt(quantityPerProduct[0], quantityPerProduct[1]);
    const productIndex = randomInt(0, products.length - 1);
    items.push({
      id: index,
      discount: 0,
      quantity,
      product: products[productIndex],
      note: "",
      price: products[productIndex].price,
    });
  }
  const total =
    Math.floor(
      items.reduce((total: number, item) => {
        return total + item.price;
      }, 0) / 1000
    ) * 1000;
  return {
    localId: v4(),
    id: 0,
    total,
    discount: 0,
    status: "draft",
    shipping_fee: 0,
    items,
    user: {
      id: 1,
      name: customerNames[randomInt(0, customerNames.length - 1)],
      token: "",
      email: "",
      phone: randomPhone(),
    },
  };
};

interface Props {
  timeout: number;
  maxOrderCount: number;
  itemCountRange: [number, number];
  quantityRange: [number, number];
}

export const useOrderGenerator = (props: Props) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const { orders, setOrders } = React.useContext(TransactionContext);
  const toast = useToast();
  React.useEffect(() => {
    loadProducts().then((products) =>
      setProducts(products.filter((product) => product.price != null))
    );
  }, []);
  React.useEffect(() => {
    if (orders == null || orders.length === 0) {
      toast({
        title: "Đang tự động thêm đơn hàng, xin vui lòng chờ",
        status: "info",
      });
    }
  }, [orders, toast]);
  const addOrder = React.useCallback(() => {
    setOrders((orders) => {
      if (
        products.length === 0 ||
        (orders != null && orders.length > props.maxOrderCount)
      ) {
        return orders;
      }
      const newOrder = randomOrder(
        props.itemCountRange,
        props.quantityRange,
        products
      );
      const newOrders = [...(orders ?? []), newOrder];
      return newOrders;
    });
  }, [setOrders, products, props]);
  React.useEffect(() => {
    if (orders == null || orders.length === 0) addOrder();
    const timeout = props.timeout;
    const timeoutID = setTimeout(() => {
      addOrder();
    }, timeout);
    return () => clearTimeout(timeoutID);
  }, [orders, addOrder, props]);
  return orders;
};
