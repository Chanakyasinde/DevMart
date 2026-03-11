import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Palette, Plug, Bot, Wrench, Zap, Shield, Download, Star, TrendingUp, Users, Package } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';

const API_URL = import.meta.env.VITE_API_URL || '';

const categories = [
    { name: 'Code Templates', icon: Code2, color: 'from-primary-500/20 to-primary-600/20', border: 'border-primary-500/30', text: 'text-primary-400', desc: 'MERN boilerplates, auth systems, dashboards' },
    { name: 'UI Kits', icon: Palette, color: 'from-accent-500/20 to-accent-600/20', border: 'border-accent-500/30', text: 'text-accent-400', desc: 'React components, Tailwind templates' },
    { name: 'APIs & Microservices', icon: Plug, color: 'from-primary-600/20 to-accent-600/20', border: 'border-primary-500/30', text: 'text-primary-400', desc: 'Auth APIs, payment wrappers' },
    { name: 'AI & ML Starter Kits', icon: Bot, color: 'from-primary-400/20 to-primary-500/20', border: 'border-primary-400/30', text: 'text-primary-300', desc: 'Chatbots, recommendation engines' },
    { name: 'Developer Tools', icon: Wrench, color: 'from-accent-400/20 to-accent-500/20', border: 'border-accent-400/30', text: 'text-accent-300', desc: 'Automation scripts, DevOps configs' },
];

const stats = [
    { label: 'Digital Products', value: '500+', icon: Package },
    { label: 'Active Developers', value: '2K+', icon: Users },
    { label: 'Downloads', value: '10K+', icon: Download },
    { label: 'Average Rating', value: '4.8', icon: Star },
];

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products?limit=6`);
                setFeaturedProducts(res.data?.data?.products || res.data?.products || []);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-fade-in">
                            <Zap className="w-4 h-4 text-primary-400" />
                            <span className="text-sm font-medium text-primary-300">
                                The Developer Marketplace
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-display text-white leading-tight mb-6 animate-slide-up">
                            Buy & Sell{' '}
                            <span className="gradient-text">Premium</span>
                            <br />
                            Developer Assets
                        </h1>

                        <p className="text-lg sm:text-xl text-surface-200/60 max-w-2xl mx-auto mb-10 animate-slide-up text-balance" style={{ animationDelay: '0.1s' }}>
                            Source code templates, UI kits, APIs, and SaaS starter kits.
                            Everything you need to ship faster.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/search" className="btn-primary text-lg !px-8 !py-4">
                                Explore Products
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/signup" className="btn-secondary text-lg !px-8 !py-4">
                                Start Selling
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="glass-card p-5 text-center"
                            >
                                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                                <p className="text-xs text-surface-200/50 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="section-title mb-3">Browse by Category</h2>
                        <p className="section-subtitle mx-auto">
                            Find the perfect digital asset for your next project
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                to={`/search?category=${encodeURIComponent(cat.name)}`}
                                className="glass-card p-6 text-center group cursor-pointer border-transparent hover:border-surface-700"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border ${cat.border}`}>
                                    <cat.icon className={`w-7 h-7 ${cat.text}`} />
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-1">{cat.name}</h3>
                                <p className="text-xs text-surface-400">{cat.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28 bg-surface-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-14">
                        <div>
                            <h2 className="section-title mb-3">Featured Products</h2>
                            <p className="section-subtitle">
                                Hand-picked digital assets from top sellers
                            </p>
                        </div>
                        <Link
                            to="/search"
                            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 glass-card">
                            <Package className="w-12 h-12 text-surface-200/20 mx-auto mb-4" />
                            <p className="text-surface-200/50 text-lg mb-2">No products yet</p>
                            <p className="text-surface-200/30 text-sm mb-6">Be the first seller to list a product!</p>
                            <Link to="/signup" className="btn-primary">
                                Start Selling
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/search" className="btn-secondary">
                            View All Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="section-title mb-3">Why DevMart?</h2>
                        <p className="section-subtitle mx-auto">
                            Built by developers, for developers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: 'Secure Digital Delivery',
                                desc: 'Encrypted file transfers with time-limited download links and license key validation.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Seller Analytics',
                                desc: 'Track earnings, download stats, and product performance with a dedicated seller dashboard.',
                            },
                            {
                                icon: Zap,
                                title: 'Ship Faster',
                                desc: 'Skip weeks of boilerplate work. Get MVP-ready templates and launch your project today.',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="glass-card p-8">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5 border border-primary-500/20">
                                    <feature.icon className="w-6 h-6 text-primary-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-surface-200/50 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative glass-card p-10 md:p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-accent-600/10" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
                                Ready to <span className="gradient-text">monetize</span> your code?
                            </h2>
                            <p className="text-surface-200/60 text-lg max-w-xl mx-auto mb-8">
                                Join DevMart as a seller and start earning from your development expertise.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/signup" className="btn-primary text-lg !px-8 !py-4">
                                    Create Seller Account
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/search" className="btn-secondary text-lg !px-8 !py-4">
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
