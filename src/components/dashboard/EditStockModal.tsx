import React, { useState, useEffect } from 'react';
import { Package, Save, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import apiClient from '@/services/apiClient';
import type { Stock } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';

interface EditStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    stock: Stock | null;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    stock
}) => {
    const [quantity, setQuantity] = useState<number | ''>(0);
    const [unitPrice, setUnitPrice] = useState<number | ''>(0);
    const [threshold, setThreshold] = useState<number | ''>(5);
    const [submitting, setSubmitting] = useState(false);

    const { addToast } = useNotificationStore();

    // Reset/Initialize values when stock changes
    useEffect(() => {
        if (stock) {
            setQuantity(stock.quantity);
            setUnitPrice(stock.unit_price);
            setThreshold(stock.low_stock_threshold || 5);
        }
    }, [stock, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stock) return;

        setSubmitting(true);
        try {
            await apiClient.patch(`/stock/${stock.id}/`, {
                quantity: quantity === '' ? 0 : quantity,
                unit_price: unitPrice === '' ? 0 : unitPrice,
                low_stock_threshold: threshold === '' ? 5 : threshold
            });
            addToast("Stock mis à jour avec succès", "success");
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update stock:', error);
            addToast("Erreur lors de la mise à jour du stock", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (!stock) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Modifier le Stock"
            size="lg"
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                            <Package size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-slate-800 uppercase truncate">
                                {stock.medication_detail?.name || 'Médicament'}
                            </p>
                            <p className="text-xs text-slate-500 font-bold">
                                {stock.medication_detail?.manufacturer || 'Fabricant inconnu'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                Quantité en stock
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                Prix de vente (GNF)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <AlertCircle size={14} className="text-amber-500" />
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Seuil d'alerte stock faible
                            </label>
                        </div>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-700"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-2xl py-6 font-bold"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 rounded-2xl py-6 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-black"
                            isLoading={submitting}
                            leftIcon={<Save size={18} />}
                        >
                            Sauvegarder les modifications
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
