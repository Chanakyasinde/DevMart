import { Link } from 'react-router-dom';
import { Star, Download, Tag, ArrowUpRight } from 'lucide-react';

const ProductCard = ({ product }) => {
    const {
        _id,
        title = 'Untitled Product',
        description = '',
        price = 0,
        category = 'Template',
        imageUrl,
        seller,
        averageRating = 0,
        totalDownloads = 0,
        tags = [],
    } = product || {};

    const categoryColors = {
        'Code Templates': 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/20',
        'UI Kits': 'from-pink-500/20 to-pink-600/20 text-pink-400 border-pink-500/20',
        'APIs': 'from-green-500/20 to-green-600/20 text-green-400 border-green-500/20',
        'AI & ML': 'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/20',
        'Developer Tools': 'from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/20',
    };

    const colorClass = categoryColors[category] || 'from-primary-500/20 to-primary-600/20 text-primary-400 border-primary-500/20';

    return (
        <Link to={`/product/${_id}`} className="group block">
            <div className="glass-card overflow-hidden h-full flex flex-col">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-surface-800 to-surface-900">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <Tag className="w-10 h-10 text-primary-500/40 mx-auto mb-2" />
                                <p className="text-xs text-surface-200/30 font-mono">{category}</p>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r border backdrop-blur-sm ${colorClass}`}>
                            {category}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1.5 line-clamp-1 group-hover:text-accent-400 transition-colors duration-200">
                        {title}
                    </h3>
                    <p className="text-surface-200/50 text-sm line-clamp-2 mb-4 flex-1">
                        {description || 'No description available.'}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {tags.slice(0, 3).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] text-surface-200/50 font-mono"
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] text-surface-200/30">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-surface-200/60">{averageRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Download className="w-3.5 h-3.5 text-surface-200/40" />
                                <span className="text-xs text-surface-200/60">{totalDownloads}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            {price === 0 ? (
                                <span className="text-sm font-bold text-accent-400">Free</span>
                            ) : (
                                <span className="text-sm font-bold text-white">
                                    ₹{price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {seller && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[10px] text-surface-950 font-bold">
                                {seller.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <span className="text-xs text-surface-400">
                                by {seller.name || 'Unknown Seller'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
