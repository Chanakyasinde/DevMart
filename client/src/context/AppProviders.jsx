import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { OrderProvider } from "./OrderContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>{children}</OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
