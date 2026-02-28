import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, DollarSign, Download, TrendingUp, Edit3, Trash2, X, AlertCircle, CheckCircle, Eye, Tag } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const categories = [
    'Code Templates',
    'UI Kits',
    'APIs & Microservices',
    'AI & ML Starter Kits',
    'Developer Tools',
];

const Seller = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Code Templates',
        techStack: '',
        tags: '',
        demoUrl: '',
        version: '1.0.0',
        licenseType: 'Single Use',
    });

    useEffect(() => {
        if (!token || !user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
            navigate('/login');
            return;
        }
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/products/seller/my-products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data?.data?.products || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            title: '', description: '', price: '', category: 'Code Templates',
            techStack: '', tags: '', demoUrl: '', version: '1.0.0', licenseType: 'Single Use',
        });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            techStack: product.techStack?.join(', ') || '',
            tags: product.tags?.join(', ') || '',
            demoUrl: product.demoUrl || '',
            version: product.version || '1.0.0',
            licenseType: product.licenseType || 'Single Use',
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            ...formData,
            price: Number(formData.price),
            techStack: formData.techStack
                ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
                : [],
            tags: formData.tags
                ? formData.tags.split(',').map((s) => s.trim()).filter(Boolean)
                : [],
        };

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/api/products/${editingProduct._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Product updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/products`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Product created successfully!');
            }
            setShowModal(false);
            fetchMyProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Product deleted.');
            fetchMyProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed.');
        }
    };

    const totalDownloads = products.reduce((sum, p) => sum + (p.downloads || 0), 0);
    const totalEarnings = products.reduce((sum, p) => sum + ((p.price || 0) * (p.downloads || 0)), 0);

    const statCards = [
        { label: 'Total Products', value: products.length, icon: Package, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Downloads', value: totalDownloads, icon: Download, color: 'from-green-500 to-green-600' },
        { label: 'Est. Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-purple-600' },
        { label: 'Avg. Rating', value: products.length > 0 ? (products.reduce((sum, p) => sum + (p.ratingsAverage || 0), 0) / products.length).toFixed(1) : '0.0', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <div className="min-h-screen py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="section-title mb-1">Seller Dashboard</h1>
                        <p className="text-surface-200/50">Manage your digital products</p>
                    </div>
                    <button onClick={openCreateModal} className="btn-primary">
                        <Plus className="w-4 h-4" />
                        New Product
                    </button>
                </div>

                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 animate-slide-down">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-sm text-green-400">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map((stat, i) => (
                        <div key={i} className="glass-card p-5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                            <p className="text-xs text-surface-200/50 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="p-5 border-b border-white/[0.06]">
                        <h2 className="text-lg font-semibold text-white">Your Products</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                    <div className="w-16 h-16 bg-surface-800 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-surface-800 rounded w-1/3" />
                                        <div className="h-3 bg-surface-800 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="divide-y divide-white/[0.04]">
                            {products.map((product) => (
                                <div key={product._id} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                                    <div className="w-16 h-16 rounded-xl bg-surface-800 flex items-center justify-center flex-shrink-0">
                                        {product.thumbnailUrl ? (
                                            <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <Tag className="w-6 h-6 text-surface-200/20" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white truncate">{product.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-surface-200/40">{product.category}</span>
                                            <span className="text-xs text-surface-200/40">v{product.version}</span>
                                            {product.isApproved ? (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-white">₹{product.price}</p>
                                            <p className="text-[10px] text-surface-200/40">Price</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-white">{product.downloads || 0}</p>
                                            <p className="text-[10px] text-surface-200/40">Downloads</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-200/50 hover:text-white transition-all"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-surface-200/50 hover:text-red-400 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Package className="w-12 h-12 text-surface-200/15 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No products yet</h3>
                            <p className="text-sm text-surface-200/40 mb-6">Create your first product to start selling</p>
                            <button onClick={openCreateModal} className="btn-primary">
                                <Plus className="w-4 h-4" /> Create Product
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white font-display">
                                {editingProduct ? 'Edit Product' : 'Create New Product'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] text-surface-200/50 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Title *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., MERN Auth Boilerplate"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows={4}
                                    className="input-field resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Price (₹) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0 for free"
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c} className="bg-surface-900">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Tech Stack</label>
                                    <input
                                        name="techStack"
                                        value={formData.techStack}
                                        onChange={handleChange}
                                        placeholder="React, Node.js, MongoDB"
                                        className="input-field"
                                    />
                                    <p className="text-[11px] text-surface-200/30 mt-1">Comma-separated</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Tags</label>
                                    <input
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="auth, boilerplate, starter"
                                        className="input-field"
                                    />
                                    <p className="text-[11px] text-surface-200/30 mt-1">Comma-separated</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Version</label>
                                    <input
                                        name="version"
                                        value={formData.version}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">License</label>
                                    <select
                                        name="licenseType"
                                        value={formData.licenseType}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="Single Use" className="bg-surface-900">Single Use</option>
                                        <option value="Multi Use" className="bg-surface-900">Multi Use</option>
                                        <option value="Open Source" className="bg-surface-900">Open Source</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-200/70 mb-1.5">Demo URL</label>
                                    <input
                                        name="demoUrl"
                                        value={formData.demoUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Seller;
