import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, X, Package, ChevronDown } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';

const API_URL = import.meta.env.VITE_API_URL || '';

const allCategories = [
    'Code Templates',
    'UI Kits',
    'APIs & Microservices',
    'AI & ML Starter Kits',
    'Developer Tools',
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'popular', label: 'Most Downloaded' },
];

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [showFilters, setShowFilters] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy]);

    useEffect(() => {
        const q = searchParams.get('q') || '';
        const cat = searchParams.get('category') || '';
        setSearchQuery(q);
        setSelectedCategory(cat);
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/products?`;
            if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
            if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;

            switch (sortBy) {
                case 'price-low': url += 'sort=price&'; break;
                case 'price-high': url += 'sort=-price&'; break;
                case 'popular': url += 'sort=-downloads&'; break;
                case 'oldest': url += 'sort=createdAt&'; break;
                default: url += 'sort=-createdAt&';
            }

            const res = await axios.get(url);
            const data = res.data?.data?.products || res.data?.products || [];
            setProducts(data);
            setTotalCount(res.data?.data?.total || res.data?.total || data.length);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (sortBy) params.sort = sortBy;
        setSearchParams(params);
        fetchProducts();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSortBy('newest');
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery || selectedCategory || sortBy !== 'newest';

    return (
        <div className="min-h-screen py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="section-title mb-2">Browse Products</h1>
                    <p className="section-subtitle">
                        Discover {totalCount > 0 ? `${totalCount} ` : ''}premium digital assets
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearchSubmit} className="flex-1">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-200/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, technology, or keyword..."
                                className="input-field !pl-12 !pr-24 !py-3.5 text-base"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2 !px-4 text-sm"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-field !pr-10 !py-3.5 appearance-none cursor-pointer min-w-[180px]"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-surface-900 text-white">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/40 pointer-events-none" />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`btn-secondary !py-3 lg:hidden ${showFilters ? '!bg-primary-500/10 !border-primary-500/30' : ''}`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
                        <div className="glass-card p-5 lg:sticky lg:top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-medium text-surface-200/50 uppercase tracking-wider mb-3">
                                    Category
                                </h4>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!selectedCategory
                                                ? 'bg-primary-500/10 text-primary-400 font-medium'
                                                : 'text-surface-200/60 hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {allCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat
                                                    ? 'bg-primary-500/10 text-primary-400 font-medium'
                                                    : 'text-surface-200/60 hover:text-white hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {searchQuery && (
                                    <span className="badge gap-1.5">
                                        "{searchQuery}"
                                        <button onClick={() => { setSearchQuery(''); setSearchParams({}); }}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="badge-accent gap-1.5">
                                        {selectedCategory}
                                        <button onClick={() => setSelectedCategory('')}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass-card overflow-hidden animate-pulse">
                                        <div className="h-48 bg-surface-800" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-5 bg-surface-800 rounded w-3/4" />
                                            <div className="h-4 bg-surface-800 rounded w-full" />
                                            <div className="h-4 bg-surface-800 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <p className="text-sm text-surface-200/40 mb-4">{totalCount} product{totalCount !== 1 ? 's' : ''} found</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 glass-card">
                                <Package className="w-14 h-14 text-surface-200/15 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
                                <p className="text-sm text-surface-200/40 mb-6">
                                    Try adjusting your search or filters
                                </p>
                                <button onClick={clearFilters} className="btn-secondary text-sm">
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
