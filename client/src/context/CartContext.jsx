import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, subtotal: 0 });
  const [isCartLoading, setIsCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setSummary({ totalItems: 0, subtotal: 0 });
      return;
    }

    setIsCartLoading(true);
    try {
      const response = await api.get("/cart");
      setCartItems(response.data.data.cartItems);
      setSummary(response.data.data.summary);
    } catch {
      setCartItems([]);
      setSummary({ totalItems: 0, subtotal: 0 });
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const response = await api.post("/cart", { productId, quantity });
    setCartItems(response.data.data.cartItems);
    setSummary(response.data.data.summary);
    return response.data;
  };

  const removeFromCart = async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    setCartItems(response.data.data.cartItems);
    setSummary(response.data.data.summary);
    return response.data;
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      cartItems,
      summary,
      isCartLoading,
      fetchCart,
      addToCart,
      removeFromCart
    }),
    [cartItems, summary, isCartLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
