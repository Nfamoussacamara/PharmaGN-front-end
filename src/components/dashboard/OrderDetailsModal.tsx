import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onValidate: (orderId: number) => void;
    onReject: (orderId: number, reason: string) => void;
    onComplete: (orderId: number) => void;
}

/**
 * Modal de détails et gestion d'une commande
 */
export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    isOpen,
    onClose,
    onValidate,
    onReject,
    onComplete
}) => {
    const [showRejectionForm, setShowRejectionForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleRejectClick = () => {
        setShowRejectionForm(true);
    };

    const handleRejectConfirm = () => {
        if (!order || !rejectionReason.trim()) return;
        onReject(order.id, rejectionReason);
        setShowRejectionForm(false);
        setRejectionReason('');
    };

    const handleClose = () => {
        setShowRejectionForm(false);
        setRejectionReason('');
        onClose();
    };

    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Commande #${order.id.toString().padStart(5, '0')}`}
            size="lg"
        >
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Info Client & Med */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Détails Médicament
                        </p>
                        <p className="text-lg font-black text-slate-800 uppercase">
                            {order.medication_detail?.name || order.medication_name || 'Médicament'}
                        </p>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Quantité demandée: <span className="text-slate-900 font-bold">{order.quantity} unités</span>
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Total Estimé
                        </p>
                        <motion.p
                            className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            {formatPrice(order.total_price)}
                        </motion.p>
                    </div>
                </div>

                {/* Ordonnance (si fournie) */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-4 flex justify-between items-center text-white border-b border-white/10">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Eye size={16} /> Examen de l'Ordonnance
                        </span>
                        {order.prescription ? (
                            <Badge variant="success">FOURNIE</Badge>
                        ) : (
                            <Badge variant="warning">AUCUNE</Badge>
                        )}
                    </div>
                    <div className="aspect-[4/3] bg-slate-800 flex items-center justify-center">
                        {order.prescription_detail ? (
                            <motion.img
                                src={order.prescription_detail.document || '/placeholder-ord.jpg'}
                                alt="Ordonnance"
                                className="h-full w-full object-contain p-2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            />
                        ) : (
                            <motion.div
                                className="text-center p-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <AlertTriangle className="text-rose-500 mx-auto mb-4" size={48} />
                                <p className="text-white font-bold uppercase tracking-tight">
                                    Aucun document joint
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                    Le client n'a pas fourni d'ordonnance pour cette réservation.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Actions - État EN ATTENTE */}
                <AnimatePresence mode="wait">
                    {order.status === 'PENDING' && !showRejectionForm && (
                        <motion.div
                            className="flex gap-4 pt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Button
                                className="flex-1 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 hover:bg-rose-100 font-black"
                                onClick={handleRejectClick}
                                leftIcon={<XCircle size={20} />}
                            >
                                Rejeter
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200 font-black"
                                onClick={() => onValidate(order.id)}
                                leftIcon={<CheckCircle size={20} />}
                            >
                                Valider la réservation
                            </Button>
                        </motion.div>
                    )}

                    {/* Formulaire de rejet */}
                    {showRejectionForm && (
                        <motion.div
                            className="space-y-4 p-6 bg-rose-50 rounded-3xl border-2 border-rose-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div>
                                <p className="text-sm font-bold text-slate-700 mb-2">
                                    Motif du rejet
                                </p>
                                <p className="text-xs text-slate-500 mb-3">
                                    Veuillez indiquer pourquoi vous refusez cette commande. Le client en sera informé.
                                </p>
                                <textarea
                                    className="w-full p-4 bg-white border-2 border-rose-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 min-h-[100px] font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="Ex: Ordonnance périmée, médicament épuisé, etc."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-2xl border-2"
                                    onClick={() => {
                                        setShowRejectionForm(false);
                                        setRejectionReason('');
                                    }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50"
                                    onClick={handleRejectConfirm}
                                    disabled={!rejectionReason.trim()}
                                >
                                    Confirmer le Rejet
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* État VALIDÉ ou PRÊT */}
                    {(order.status === 'VALIDATED' || order.status === 'READY') && (
                        <motion.div
                            className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-3xl border-2 border-emerald-200"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle className="text-emerald-500 mx-auto mb-3" size={40} />
                            </motion.div>
                            <p className="text-emerald-900 font-black text-lg">
                                CETTE COMMANDE EST EN COURS
                            </p>
                            <p className="text-emerald-600 text-sm font-medium mt-1 uppercase tracking-tighter">
                                Statut: {order.status}
                            </p>
                            <Button
                                className="mt-6 w-full rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                                onClick={() => onComplete(order.id)}
                            >
                                Marquer comme Récupérée
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Modal>
    );
};
