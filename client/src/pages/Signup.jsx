import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Package, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'BUYER',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/users/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            const { token, user } = res.data?.data || res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Use href for a clean full-page redirect that also refreshes app state
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'BUYER', label: 'Buyer', desc: 'Purchase digital assets' },
        { value: 'SELLER', label: 'Seller', desc: 'Sell your products' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-accent-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-primary-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md animate-scale-in">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow">
                            <Package className="w-5 h-5 text-surface-950" />
                        </div>
                        <span className="text-2xl font-bold font-display text-white">
                            Dev<span className="gradient-text">Mart</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white font-display">Create your account</h1>
                    <p className="text-surface-200/50 text-sm mt-1">
                        Join the developer marketplace
                    </p>
                </div>

                <div className="glass-card p-8">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6 animate-slide-down">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-200/70 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="input-field !pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-200/70 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="input-field !pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-200/70 mb-2">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        className={`p-3 rounded-xl border text-left transition-all duration-200 ${formData.role === role.value
                                            ? 'bg-primary-500/10 border-primary-500/30 ring-1 ring-primary-500/20'
                                            : 'bg-surface-800 border-surface-700 hover:bg-surface-700'
                                            }`}
                                    >
                                        <p className={`text-sm font-semibold ${formData.role === role.value ? 'text-primary-400' : 'text-white'}`}>
                                            {role.label}
                                        </p>
                                        <p className="text-xs text-surface-200/40 mt-0.5">{role.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-200/70 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    className="input-field !pl-11 !pr-11"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-200/30 hover:text-surface-200/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-200/70 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    className="input-field !pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-surface-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent-500 hover:text-accent-400 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
