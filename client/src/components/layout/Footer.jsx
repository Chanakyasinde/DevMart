import { Link } from 'react-router-dom';
import { Package, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { label: 'Browse Products', path: '/search' },
            { label: 'Categories', path: '/search' },
            { label: 'Trending', path: '/search?sort=popular' },
            { label: 'New Arrivals', path: '/search?sort=newest' },
        ],
        Company: [
            { label: 'About Us', path: '/' },
            { label: 'Blog', path: '/' },
            { label: 'Careers', path: '/' },
            { label: 'Contact', path: '/' },
        ],
        Support: [
            { label: 'Help Center', path: '/' },
            { label: 'Terms of Service', path: '/' },
            { label: 'Privacy Policy', path: '/' },
            { label: 'Seller Guide', path: '/' },
        ],
    };

    return (
        <footer className="mt-auto border-t border-white/[0.06] bg-surface-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display text-white">
                                Dev<span className="gradient-text">Mart</span>
                            </span>
                        </Link>
                        <p className="text-sm text-surface-200/50 mb-4 max-w-xs">
                            The marketplace where developers buy and sell premium digital assets, templates, and tools.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:support@devmart.com"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-surface-200/50 hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-surface-200/40">
                        © {currentYear} DevMart. All rights reserved.
                    </p>
                    <p className="text-sm text-surface-200/40 flex items-center gap-1">
                        Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for developers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
