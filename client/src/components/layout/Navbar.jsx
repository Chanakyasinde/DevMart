import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, LogOut, Package, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!token;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsProfileOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/search', label: 'Browse' },
    ];

    if (isLoggedIn && user?.role === 'SELLER') {
        navLinks.push({ path: '/seller', label: 'Seller Dashboard' });
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                            <Package className="w-5 h-5 text-surface-950" />
                        </div>
                        <span className="text-xl font-bold font-display text-white">
                            Dev<span className="gradient-text">Mart</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                    ? 'text-white bg-white/[0.08]'
                                    : 'text-surface-200/60 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex items-center flex-1 max-w-md mx-6"
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search templates, UI kits, APIs..."
                                className="w-full pl-10 pr-4 py-2.5 bg-surface-900 border border-surface-800 rounded-xl text-sm text-white placeholder-surface-400 focus:outline-none focus:border-accent-500/40 focus:bg-surface-850 focus:ring-1 focus:ring-accent-500/20 transition-all duration-200"
                            />
                        </div>
                    </form>

                    <div className="hidden lg:flex items-center gap-3">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-surface-950 text-sm font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-surface-200/80">
                                        {user?.name || 'User'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-surface-200/40 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 glass-card p-2 animate-slide-down">
                                        <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                                            <p className="text-sm font-semibold text-white">{user?.name}</p>
                                            <p className="text-xs text-surface-200/50">{user?.email}</p>
                                            <span className="badge mt-1.5 text-[10px]">{user?.role}</span>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-200/70 hover:text-white hover:bg-white/[0.06] transition-all"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="lg:hidden bg-surface-900/95 backdrop-blur-xl border-t border-white/[0.06] animate-slide-down">
                    <div className="px-4 py-4 space-y-2">
                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="input-field !pl-10 !py-2.5 text-sm"
                                />
                            </div>
                        </form>

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === link.path
                                    ? 'text-white bg-white/[0.08]'
                                    : 'text-surface-200/60 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-white/[0.06] space-y-2">
                            {isLoggedIn ? (
                                <>
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                                        <p className="text-xs text-surface-200/50">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login" className="btn-secondary flex-1 !py-2.5 text-sm">
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="btn-primary flex-1 !py-2.5 text-sm">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
