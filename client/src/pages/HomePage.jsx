import { useEffect, useState } from "react";

import api from "../services/api";
import { ProductCard } from "../components/common/ProductCard";
import { Loader } from "../components/common/Loader";
import { ErrorMessage } from "../components/common/ErrorMessage";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/products");
        setProducts(response.data.data.products || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryOptions = [
    "all",
    ...new Set(products.map((product) => product.category).filter(Boolean).map((category) => category.toLowerCase()))
  ];

  const filteredProducts = products
    .filter((product) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const productName = product.name.toLowerCase();
      const productCategory = (product.category || "").toLowerCase();
      const productDescription = (product.description || "").toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        productName.includes(normalizedSearch) ||
        productCategory.includes(normalizedSearch) ||
        productDescription.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" || productCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((leftProduct, rightProduct) => {
      if (sortBy === "price-low") {
        return leftProduct.price - rightProduct.price;
      }

      if (sortBy === "price-high") {
        return rightProduct.price - leftProduct.price;
      }

      if (sortBy === "name-asc") {
        return leftProduct.name.localeCompare(rightProduct.name);
      }

      return new Date(rightProduct.createdAt).getTime() - new Date(leftProduct.createdAt).getTime();
    });

  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">ShopEase Store</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Discover Products You Will Actually Love</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
          Browse curated products, check details instantly, and build your cart for a smooth checkout flow.
        </p>
      </header>

      {isLoading && <Loader text="Fetching products..." />}
      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && (
        <>
          <section className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
            <label className="text-sm font-medium text-slate-700">
              Search
              <input
                type="text"
                placeholder="Search by name, category, description"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Category
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[var(--brand)]"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </label>
          </section>

          <p className="text-sm text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-slate-600">
              <p className="text-lg font-semibold text-slate-800">No matching products found</p>
              <p className="mt-1 text-sm">Try changing your search text or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
