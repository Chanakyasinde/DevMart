import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useCart } from "../context/CartContext";

export function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data.data.product);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const onAddToCart = async () => {
    if (!product) return;

    try {
      setIsAdding(true);
      setFeedback("");
      await addToCart(product._id, quantity);
      setFeedback("Added to cart successfully.");
    } catch (requestError) {
      setFeedback(requestError.response?.data?.message || "Failed to add product to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <Loader text="Loading product details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found." />;

  const isOutOfStock = product.stock <= 0;

  return (
    <section className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <img src={product.imageUrl} alt={product.name} className="h-80 w-full rounded-xl object-cover" />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-slate-600">{product.description}</p>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{product.category}</p>
        <p className={`text-sm font-semibold ${isOutOfStock ? "text-rose-600" : "text-emerald-600"}`}>
          {isOutOfStock ? "Currently out of stock" : `${product.stock} items available`}
        </p>
        <p className="text-2xl font-bold text-slate-900">Rs. {product.price}</p>

        <div className="flex items-center gap-3">
          <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={Math.max(1, product.stock)}
            value={quantity}
            onChange={(event) => {
              const nextValue = Number(event.target.value || 1);
              const boundedValue = Math.max(1, Math.min(nextValue, Math.max(1, product.stock)));
              setQuantity(boundedValue);
            }}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
            disabled={isOutOfStock}
          />
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={isOutOfStock || isAdding}
          className="rounded-lg bg-[var(--brand)] px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAdding ? "Adding..." : "Add To Cart"}
        </button>
        {feedback && <p className="text-sm font-medium text-slate-600">{feedback}</p>}
      </div>
    </section>
  );
}
