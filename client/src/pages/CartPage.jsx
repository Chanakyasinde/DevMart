import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, summary, isCartLoading, removeFromCart } = useCart();
  const { createOrder, isCreatingOrder } = useOrder();
  const [error, setError] = useState("");
  const [isRemoving, setIsRemoving] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "cod"
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const validateCheckout = () => {
    const requiredFields = [
      "fullName",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country"
    ];

    const missingField = requiredFields.find((field) => !form[field].trim());
    if (missingField) {
      return "Please complete all shipping address fields.";
    }

    if (cartItems.length === 0) {
      return "Your cart is empty.";
    }

    return "";
  };

  const onCheckout = async (event) => {
    event.preventDefault();

    const validationError = validateCheckout();
    if (validationError) {
      setError(validationError);
      setSuccessMessage("");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await createOrder({
        shippingAddress: {
          fullName: form.fullName,
          addressLine1: form.addressLine1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      });

      setSuccessMessage("Order placed successfully.");
      navigate("/orders");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not place order.");
    }
  };

  if (isCartLoading) {
    return <Loader text="Loading cart..." />;
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-lg font-semibold text-slate-800">No items in cart yet.</p>
            <Link
              to="/"
              className="mt-3 inline-block rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <article key={item._id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
                <img src={item.product.imageUrl} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                  <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium text-slate-800">Rs. {item.product.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-semibold text-slate-900">Rs. {item.product.price * item.quantity}</p>
                  <button
                    onClick={async () => {
                      setIsRemoving(item.product._id);
                      try {
                        await removeFromCart(item.product._id);
                      } catch (removeError) {
                        setError(removeError.response?.data?.message || "Failed to remove item.");
                      } finally {
                        setIsRemoving(null);
                      }
                    }}
                    disabled={isRemoving === item.product._id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    title="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <form onSubmit={onCheckout} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold text-slate-900">Checkout</h2>

          <label className="block text-sm font-medium text-slate-700">
            Full Name
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Address Line
            <input
              type="text"
              name="addressLine1"
              value={form.addressLine1}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm font-medium text-slate-700">
              City
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              State
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm font-medium text-slate-700">
              Postal Code
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Country
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Payment Method
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={onChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </label>

          {error && <ErrorMessage message={error} />}
          {successMessage && <p className="text-sm font-medium text-emerald-700">{successMessage}</p>}

          <footer className="rounded-lg bg-slate-50 p-3">
            <p className="text-sm text-slate-600">Items: {summary.totalItems}</p>
            <p className="text-lg font-bold text-slate-900">Subtotal: Rs. {summary.subtotal}</p>
          </footer>

          <button
            type="submit"
            disabled={isCreatingOrder || cartItems.length === 0}
            className="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingOrder ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </aside>
    </section>
  );
}
