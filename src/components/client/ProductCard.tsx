import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Building2 } from 'lucide-react';
import { Product } from '@/types/client';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const addToCart = useCartStore(state => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
    };

    const calculateDiscountPrice = (price: number, discount?: number) => {
        if (!discount) return price;
        return Math.round(price * (1 - discount / 100));
    };

    const discountedPrice = calculateDiscountPrice(product.price, product.discount);

    // Mock rating data
    const rating = (4 + Math.random()).toFixed(1);
    const reviews = Math.floor(Math.random() * 2000) + 500;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-2xl border border-transparent overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
        >
            {/* Image produit Area */}
            <div className="relative aspect-square bg-[#f8f9fa] flex items-center justify-center p-4 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badge réduction - Circular Orange */}
                {product.discount && (
                    <div className="absolute top-3 right-3 w-10 h-10 bg-[#ff7043] text-white flex items-center justify-center text-[10px] font-bold rounded-full shadow-lg">
                        -{product.discount}%
                    </div>
                )}

                {/* Badge stock status */}
                {product.stock === 0 ? (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                        Rupture de stock
                    </div>
                ) : product.stock <= 10 ? (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                        Stock limité
                    </div>
                ) : (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                        Disponible
                    </div>
                )}
            </div>

            {/* Infos produit */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category/Brand */}
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {product.category || 'PHARMACIE'}
                </span>

                {/* Price */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-900">
                        {discountedPrice.toLocaleString('fr-FR')} GNF
                    </span>
                    {product.discount && (
                        <span className="text-[10px] text-gray-400 line-through">
                            {product.price.toLocaleString('fr-FR')} GNF
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 leading-tight flex-1">
                    {product.name}
                </h3>

                {/* Rating - Green Star */}
                <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    <span className="text-sm font-bold text-gray-700">{rating}</span>
                    <span className="text-sm text-gray-400">({reviews.toLocaleString()} reviews)</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex-1 min-h-[38px] border-2 rounded-full font-bold text-[10px] transition-all flex items-center justify-center px-4 ${product.stock === 0
                            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                            }`}
                    >
                        {product.stock === 0 ? 'Rupture' : 'Ajouter au panier'}
                    </button>

                    <button className="w-9 h-9 border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Pharmacy Info (Optional but useful for context) */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                    <Building2 className="w-3 h-3 text-emerald-500" />
                    <span className="uppercase tracking-wider">{product.pharmacy}</span>
                </div>
            </div>
        </motion.div>
    );
};
