import { Link } from "react-router-dom";

import { Loader } from "../components/common/Loader";
import { useOrder } from "../context/OrderContext";

export function OrdersPage() {
  const { orders, isOrdersLoading } = useOrder();

  if (isOrdersLoading) {
    return <Loader text="Loading your orders..." />;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Continue shopping
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-lg font-semibold text-slate-800">No orders yet</p>
          <p className="mt-1 text-sm text-slate-600">Create your first order from the cart page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.product?._id || item.name} className="flex items-center justify-between gap-3 text-sm">
                    <p className="text-slate-700">
                      {item.name} x {item.quantity}
                    </p>
                    <p className="font-semibold text-slate-900">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Total:</span> Rs. {order.totalAmount}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Payment:</span> {order.paymentMethod.toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Placed:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
