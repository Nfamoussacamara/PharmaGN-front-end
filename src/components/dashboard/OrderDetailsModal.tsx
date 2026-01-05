import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Package, Calendar,
    FileText, Check, AlertTriangle, Pill, Clock
} from 'lucide-react';
import type { Order } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onValidate: (orderId: number) => void;
    onReject: (orderId: number, reason: string) => void;
    onComplete: (orderId: number) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    isOpen,
    onClose,
    onValidate,
    onReject,
    onComplete
}) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    if (!order) return null;

    const handleRejectSubmit = () => {
        if (rejectionReason.trim()) {
            onReject(order.id, rejectionReason);
            setRejectionReason('');
            setShowRejectForm(false);
        }
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        'PENDING': { label: 'En attente', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
        'VALIDATED': { label: 'Validée', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
        'READY': { label: 'Prête', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
        'COMPLETED': { label: 'Complétée', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
        'REJECTED': { label: 'Rejetée', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
    };

    const status = statusConfig[order.status] || statusConfig['PENDING'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Package size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-text-heading-primary">
                                        Commande #{String(order.id).padStart(5, '0')}
                                    </h3>
                                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mt-1", status.bg, status.color)}>
                                        <Clock size={12} />
                                        {status.label}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[calc(90vh-200px)] overflow-y-auto px-8 py-6 space-y-6">
                            {/* Patient Info */}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <User size={16} />
                                    Informations Patient
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1">Nom complet</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {order.patient_detail?.full_name || order.patient_name || 'Non spécifié'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1">Rôle</p>
                                        <p className="text-sm font-bold text-slate-900">
                                            {order.patient_detail?.role || 'Patient'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="bg-emerald-50 rounded-2xl p-6 space-y-4">
                                <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                    <Pill size={16} />
                                    Détails de la commande
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">Médicament</span>
                                        <span className="text-sm font-black text-slate-900">
                                            {order.medication_detail?.name || order.medication_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">Quantité</span>
                                        <span className="text-sm font-black text-slate-900">
                                            {order.quantity} unité{order.quantity > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">Prix unitaire</span>
                                        <span className="text-sm font-bold text-emerald-700">
                                            {formatPrice(order.unit_price)}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t-2 border-emerald-100 flex items-center justify-between">
                                        <span className="text-base font-black text-slate-900">Prix total</span>
                                        <span className="text-xl font-black text-emerald-700">
                                            {formatPrice(order.total_price)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border-2 border-slate-100 rounded-2xl p-4">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Calendar size={14} />
                                        Date de commande
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="bg-white border-2 border-slate-100 rounded-2xl p-4">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <FileText size={14} />
                                        Ordonnance
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {order.prescription ? 'Oui' : 'Non'}
                                    </p>
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            {order.rejection_reason && (
                                <div className="bg-rose-50 rounded-2xl p-6">
                                    <h4 className="text-sm font-black text-rose-700 uppercase tracking-wider mb-2">Raison du rejet</h4>
                                    <p className="text-sm font-medium text-slate-700">{order.rejection_reason}</p>
                                </div>
                            )}

                            {/* Rejection Form */}
                            {showRejectForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 rounded-2xl p-6"
                                >
                                    <label className="block text-sm font-black text-rose-700 uppercase tracking-wider mb-3">
                                        Raison du rejet
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-rose-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                                        rows={3}
                                        placeholder="Expliquez pourquoi cette commande est rejetée..."
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            {order.status === 'PENDING' && (
                                <>
                                    {!showRejectForm ? (
                                        <>
                                            <button
                                                onClick={() => setShowRejectForm(true)}
                                                className="flex-1 py-3 bg-white border-2 border-rose-200 text-rose-600 rounded-2xl text-sm font-black hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <AlertTriangle size={16} />
                                                Rejeter
                                            </button>
                                            <button
                                                onClick={() => onValidate(order.id)}
                                                className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Check size={16} />
                                                Valider la commande
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setShowRejectForm(false);
                                                    setRejectionReason('');
                                                }}
                                                className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleRejectSubmit}
                                                disabled={!rejectionReason.trim()}
                                                className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-rose-600/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <AlertTriangle size={16} />
                                                Confirmer le rejet
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                            {order.status === 'VALIDATED' && (
                                <button
                                    onClick={() => onComplete(order.id)}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    Marquer comme récupérée
                                </button>
                            )}
                            {(order.status === 'COMPLETED' || order.status === 'REJECTED') && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-2xl text-sm font-black hover:bg-slate-300 transition-all"
                                >
                                    Fermer
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
