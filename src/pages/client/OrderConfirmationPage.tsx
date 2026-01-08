import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, ArrowRight } from 'lucide-react';
import { Order } from '@/types/client';
import { getOrderById } from '@/services/orderService';
import { OrderStatusBadge } from '@/components/client/OrderStatusBadge';

export const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        if (!orderId) return;
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Erreur chargement commande:', error);
        }
    };

    const copyOrderNumber = () => {
        if (order) {
            navigator.clipboard.writeText(order.orderNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Chargement de votre commande...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-[2.5rem] mb-6 shadow-xl shadow-emerald-500/10">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                        Commande confirmée !
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        Merci pour votre confiance, PharmaGN s'occupe du reste
                    </p>
                </motion.div>

                {/* Order Number */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
                            <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
                        </div>
                        <button
                            onClick={copyOrderNumber}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <Copy className="w-5 h-5" />
                            {copied ? 'Copié !' : 'Copier'}
                        </button>
                    </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Récapitulatif de la commande
                    </h2>

                    <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Quantité: {item.quantity} × {item.price.toLocaleString('fr-FR')} GNF
                                    </p>
                                </div>
                                <div className="font-bold text-gray-900">
                                    {(item.price * item.quantity).toLocaleString('fr-FR')} GNF
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                        <span className="text-3xl font-black text-emerald-600">
                            {Math.round(order.totalAmount).toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-400 uppercase">GNF</span>
                        </span>
                    </div>
                </motion.div>

                {/* Delivery Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Informations de livraison
                    </h2>

                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold">Nom:</span> {order.deliveryAddress.fullname}</p>
                        <p><span className="font-semibold">Téléphone:</span> {order.deliveryAddress.phone}</p>
                        <p><span className="font-semibold">Email:</span> {order.deliveryAddress.email}</p>
                        <p><span className="font-semibold">Adresse:</span> {order.deliveryAddress.street}</p>
                        <p><span className="font-semibold">Ville:</span> {order.deliveryAddress.city}, {order.deliveryAddress.quarter}</p>
                        {order.deliveryAddress.instructions && (
                            <p><span className="font-semibold">Instructions:</span> {order.deliveryAddress.instructions}</p>
                        )}
                    </div>
                </motion.div>

                {/* Status Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Statut actuel
                    </h2>

                    <div className="mb-4">
                        <OrderStatusBadge status={order.status} size="lg" />
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-50"></div>

                        <div className="space-y-8 relative">
                            {['pending', 'confirmed', 'ready', 'delivered'].map((status, index) => {
                                const isActive = ['pending', 'confirmed', 'ready', 'delivered'].indexOf(order.status) >= index;
                                const labels = {
                                    pending: 'En attente de confirmation',
                                    confirmed: 'Commande confirmée',
                                    ready: 'Prête pour livraison',
                                    delivered: 'Livrée'
                                };

                                return (
                                    <div key={status} className="flex items-center gap-5">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 shadow-lg transition-all duration-500 ${isActive ? 'bg-emerald-600 shadow-emerald-500/20 rotate-0' : 'bg-white border-2 border-slate-100 text-slate-300'
                                            }`}>
                                            {isActive ? <CheckCircle className="w-5 h-5 text-white" /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                        </div>
                                        <p className={`font-black tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {labels[status as keyof typeof labels]}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button
                        onClick={() => navigate('/catalogue')}
                        className="flex-2 px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-95 transition-all text-lg"
                    >
                        Retour au catalogue
                    </button>

                    <button
                        onClick={() => navigate('/historique')}
                        className="flex-1 flex items-center justify-center gap-3 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 font-black rounded-2xl transition-all shadow-lg shadow-slate-900/5 hover:scale-[1.02] active:scale-95"
                    >
                        Mes commandes
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
