import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Building2, Shield, Truck, Phone } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { QuantitySelector } from '@/components/client/QuantitySelector';

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();

    const calculateItemPrice = (item: typeof items[0]) => {
        const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return price * item.quantity;
    };

    const subtotal = getTotal();
    const deliveryFee = 0; // Gratuit
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                            Mon panier
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                            {items.length} article{items.length > 1 ? 's' : ''} dans votre sélection
                        </p>
                    </div>

                    {items.length === 0 ? (
                        // Empty cart
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-900/5"
                        >
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <ShoppingCart className="w-12 h-12 text-slate-300" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                                Votre panier est vide
                            </h2>
                            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                                Parcourez notre catalogue et trouvez les médicaments dont vous avez besoin.
                            </p>
                            <button
                                onClick={() => navigate('/catalogue')}
                                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:scale-105 transition-all"
                            >
                                Découvrir le catalogue →
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Items column */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl p-6 shadow-sm"
                                    >
                                        <div className="flex gap-6">
                                            {/* Image */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                            />

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <Building2 className="w-4 h-4" />
                                                            {item.pharmacy}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        aria-label="Supprimer"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-500" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity */}
                                                    <QuantitySelector
                                                        quantity={item.quantity}
                                                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                                        max={item.stock}
                                                    />

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-slate-900">
                                                            {Math.round(calculateItemPrice(item)).toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-400">GNF</span>
                                                        </p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                                            {item.price.toLocaleString('fr-FR')} GNF × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Stock warning */}
                                                {item.quantity >= item.stock && (
                                                    <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
                                                        <span>⚠️ Stock maximum atteint</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Summary column */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Résumé de la commande
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-slate-500 font-bold text-sm">
                                            <span>Sous-total</span>
                                            <span className="text-slate-900">
                                                {Math.round(subtotal).toLocaleString('fr-FR')} GNF
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-slate-500 font-bold text-sm">
                                            <span>Frais de livraison</span>
                                            <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Gratuit</span>
                                        </div>

                                        <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                                            <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
                                            <span className="text-3xl font-black text-emerald-600">
                                                {Math.round(total).toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-400">GNF</span>
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/commander')}
                                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-black rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-95 transition-all mb-4 flex items-center justify-center gap-3"
                                    >
                                        Passer à la caisse
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => navigate('/catalogue')}
                                        className="w-full py-4 text-slate-500 font-black text-sm hover:text-emerald-600 transition-colors"
                                    >
                                        ← Continuer mes achats
                                    </button>

                                    {/* Trust badges */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>Paiement 100% sécurisé</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>Livraison rapide garantie</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>Support client 24/7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
