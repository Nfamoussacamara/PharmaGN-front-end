import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { createOrder } from '@/services/orderService';
import { OrderFormData } from '@/types/client';

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCartStore();
    const { setCurrentOrder, addToHistory } = useOrderStore();
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash'>('mobile_money');

    const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>({
        defaultValues: {
            paymentMethod: 'mobile_money'
        }
    });

    const total = getTotal();

    const onSubmit = async (data: OrderFormData) => {
        if (items.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        setSubmitting(true);
        try {
            const order = await createOrder(data, items);
            setCurrentOrder(order);
            addToHistory(order);
            clearCart();
            navigate(`/confirmation/${order.id}`);
        } catch (error) {
            console.error('Erreur création commande:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        navigate('/panier');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                        Paiement sécurisé
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        Plus qu'une étape avant de finaliser votre commande
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-900/5 border border-slate-50">

                            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                                Vos informations
                            </h2>

                            {/* Full Name */}
                            <div className="mb-8">
                                <label htmlFor="fullname" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    {...register('fullname', {
                                        required: 'Le nom complet est requis',
                                        minLength: { value: 3, message: 'Minimum 3 caractères' }
                                    })}
                                    placeholder="Ex: Mamadou Diallo"
                                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                                {errors.fullname && (
                                    <p className="mt-2 text-xs font-bold text-rose-500">{errors.fullname.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="mb-8">
                                <label htmlFor="phone" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register('phone', {
                                        required: 'Le numéro de téléphone est requis',
                                        pattern: {
                                            value: /^(\+224|00224|0)?[67]\d{8}$/,
                                            message: 'Format invalide (ex: +224620123456)'
                                        }
                                    })}
                                    placeholder="+224 620 12 34 56"
                                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-xs font-bold text-rose-500">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-8">
                                <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register('email', {
                                        required: "L'email est requis",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email invalide'
                                        }
                                    })}
                                    placeholder="exemple@email.com"
                                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-xs font-bold text-rose-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="mb-8">
                                <label htmlFor="street" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Adresse complète
                                </label>
                                <input
                                    type="text"
                                    id="street"
                                    {...register('street', { required: "L'adresse est requise" })}
                                    placeholder="Ex: Rue KA-123, Quartier Kaloum"
                                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                                {errors.street && (
                                    <p className="mt-2 text-xs font-bold text-rose-500">{errors.street.message}</p>
                                )}
                            </div>

                            {/* City & Quarter */}
                            <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label htmlFor="city" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        {...register('city', { required: 'La ville est requise' })}
                                        placeholder="Conakry"
                                        className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                    />
                                    {errors.city && (
                                        <p className="mt-2 text-xs font-bold text-rose-500">{errors.city.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="quarter" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                        Quartier
                                    </label>
                                    <input
                                        type="text"
                                        id="quarter"
                                        {...register('quarter', { required: 'Le quartier est requis' })}
                                        placeholder="Kaloum"
                                        className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                    />
                                    {errors.quarter && (
                                        <p className="mt-2 text-xs font-bold text-rose-500">{errors.quarter.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-10">
                                <label htmlFor="instructions" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Instructions de livraison
                                </label>
                                <textarea
                                    id="instructions"
                                    {...register('instructions')}
                                    rows={3}
                                    placeholder="Ex: Appeler avant de livrer"
                                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>

                            {/* Payment Method */}
                            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                                Mode de paiement
                            </h2>

                            <div className="space-y-4 mb-8">
                                {/* Mobile Money */}
                                <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'mobile_money' ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-500/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        value="mobile_money"
                                        {...register('paymentMethod')}
                                        onChange={() => setPaymentMethod('mobile_money')}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 font-black text-slate-900 mb-1">
                                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            Mobile Money
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">
                                            Orange Money, MTN, Moov
                                        </p>
                                    </div>
                                </label>

                                {/* Cash */}
                                <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-500/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        value="cash"
                                        {...register('paymentMethod')}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 font-black text-slate-900 mb-1">
                                            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                                                💵
                                            </div>
                                            Espèces à la livraison
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">
                                            Payez directement lors de la réception
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Mobile Money Fields */}
                            {paymentMethod === 'mobile_money' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-6 mb-10 overflow-hidden"
                                >
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                            Opérateur
                                        </label>
                                        <select
                                            {...register('mobileMoneyOperator', {
                                                required: paymentMethod === 'mobile_money'
                                            })}
                                            className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900 appearance-none bg-white"
                                        >
                                            <option value="">Sélectionner un opérateur</option>
                                            <option value="orange">Orange Money</option>
                                            <option value="mtn">MTN Money</option>
                                            <option value="moov">Moov Money</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                            Numéro de téléphone payeur
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('mobileMoneyNumber', {
                                                required: paymentMethod === 'mobile_money'
                                            })}
                                            placeholder="+224 620 12 34 56"
                                            className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        Confirmer et payer
                                        <ShoppingCart className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/5 border border-slate-50 sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">
                                Votre panier
                            </h3>

                            <div className="space-y-4 mb-8">
                                {items.slice(0, 3).map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-900 line-clamp-1 truncate">{item.name}</p>
                                            <p className="text-xs font-bold text-slate-400">Qté: {item.quantity}</p>
                                            <p className="text-sm font-black text-emerald-600">{(item.price * item.quantity).toLocaleString('fr-FR')} GNF</p>
                                        </div>
                                    </div>
                                ))}
                                {items.length > 3 && (
                                    <p className="text-xs font-bold text-slate-400 text-center bg-slate-50 py-2 rounded-xl">
                                        + {items.length - 3} autre{items.length - 3 > 1 ? 's' : ''} article{items.length - 3 > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-emerald-600">
                                        {Math.round(total).toLocaleString('fr-FR')} <span className="text-sm font-bold text-emerald-400">GNF</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
