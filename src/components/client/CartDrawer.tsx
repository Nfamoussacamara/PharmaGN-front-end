import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { QuantitySelector } from './QuantitySelector';

export const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const {
        items,
        isCartOpen,
        toggleCart,
        updateQuantity,
        removeFromCart,
        getTotal
    } = useCartStore();

    const handleCheckout = () => {
        toggleCart();
        navigate('/panier');
    };


    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-50 rounded-xl">
                                    <ShoppingCart className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    Mon panier
                                    {items.length > 0 && (
                                        <span className="ml-2 text-sm font-bold text-emerald-600">
                                            ({items.length} produit{items.length > 1 ? 's' : ''})
                                        </span>
                                    )}
                                </h3>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                                aria-label="Fermer le panier"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className="flex-1 overflow-y-auto p-6 space-y-4"
                            style={{ maxHeight: 'calc(100vh - 250px)' }}
                        >
                            {items.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <ShoppingCart className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold mb-6">Votre panier est vide</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-emerald-600 hover:text-emerald-700 font-black flex items-center gap-2 mx-auto"
                                    >
                                        Continuer mes achats →
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {item.price.toLocaleString('fr-FR')} GNF
                                            </p>

                                            {/* Quantity */}
                                            <QuantitySelector
                                                quantity={item.quantity}
                                                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                                max={item.stock}
                                                size="sm"
                                            />
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors self-start"
                                            aria-label="Supprimer du panier"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Estimatif</span>
                                    <span className="text-3xl font-black text-slate-900">
                                        {Math.round(getTotal()).toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-400 uppercase">GNF</span>
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-black rounded-2xl shadow-xl shadow-emerald-600/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    Valider ma commande
                                    <ShoppingCart className="w-5 h-5" />
                                </button>

                                <p className="text-center mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    ✓ Livraison rapide & Paiement sécurisé
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
