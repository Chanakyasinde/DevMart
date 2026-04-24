import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchMyOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    setIsOrdersLoading(true);
    try {
      const response = await api.get("/orders/my-orders");
      setOrders(response.data.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const createOrder = async ({ shippingAddress, paymentMethod }) => {
    setIsCreatingOrder(true);
    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod
      });

      const createdOrder = response.data.data.order;
      setOrders((previousOrders) => [createdOrder, ...previousOrders]);
      await fetchCart();

      return response.data;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      orders,
      isOrdersLoading,
      isCreatingOrder,
      fetchMyOrders,
      createOrder
    }),
    [orders, isOrdersLoading, isCreatingOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }

  return context;
}
