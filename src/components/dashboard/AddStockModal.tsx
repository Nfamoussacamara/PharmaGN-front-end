import React, { useState } from 'react';
import { Search, Plus, Package, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { medicationService } from '@/services/medication.service';
import apiClient from '@/services/apiClient';
import type { Medication } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';

interface AddStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [medications, setMedications] = useState<Medication[]>([]);
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [searching, setSearching] = useState(false);

    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [threshold, setThreshold] = useState<number>(5);
    const [submitting, setSubmitting] = useState(false);

    const { addToast } = useNotificationStore();

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setSearching(true);
        try {
            const response = await medicationService.getAll({ search: searchTerm });
            setMedications(response.results);
        } catch (error) {
            addToast("Erreur lors de la recherche", "error");
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMedication) return;

        setSubmitting(true);
        try {
            await apiClient.post('/stock/', {
                medication: selectedMedication.id,
                quantity,
                unit_price: unitPrice,
                low_stock_threshold: threshold
            });
            addToast("Médicament ajouté au stock", "success");
            onSuccess();
            handleClose();
        } catch (error) {
            addToast("Erreur lors de l'ajout au stock", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSearchTerm('');
        setMedications([]);
        setSelectedMedication(null);
        setQuantity(0);
        setUnitPrice(0);
        setThreshold(5);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ajouter au Stock"
            size="lg"
        >
            <div className="space-y-6">
                {!selectedMedication ? (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, molécule..."
                                    className="w-full pl-10 pr-4 py-2 bg-bg-app/50 border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} isLoading={searching}>
                                Chercher
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2">
                            {medications.map((med) => (
                                <button
                                    key={med.id}
                                    onClick={() => setSelectedMedication(med)}
                                    className="flex items-center justify-between p-4 bg-bg-card border border-border-light rounded-2xl hover:border-primary hover:bg-primary-light/30 transition-all text-left group"
                                >
                                    <div>
                                        <p className="font-black text-text-heading-tertiary uppercase tracking-tight">{med.name}</p>
                                        <p className="text-xs text-text-body-secondary font-medium">{med.manufacturer}</p>
                                    </div>
                                    <Plus size={20} className="text-text-disabled group-hover:text-primary" />
                                </button>
                            ))}
                            {searchTerm && medications.length === 0 && !searching && (
                                <p className="text-center py-8 text-text-disabled font-medium">
                                    Aucun médicament trouvé pour "{searchTerm}"
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-primary-light rounded-2xl border border-border-light shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-text-on-primary shadow-sm">
                                    <Package size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-primary-800 uppercase truncate">{selectedMedication.name}</p>
                                    <p className="text-xs text-primary font-bold">{selectedMedication.manufacturer}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedMedication(null)}
                                className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-disabled uppercase tracking-widest pl-1">
                                    Quantité initiale
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full p-3 bg-bg-app/50 border-2 border-border-light rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-text-heading-tertiary"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-disabled uppercase tracking-widest pl-1">
                                    Prix de vente (FG)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full p-3 bg-bg-app/50 border-2 border-border-light rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-text-heading-tertiary"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                                />
                                <p className="text-[10px] text-text-disabled font-medium italic pl-1">
                                    Prix unitaire facturé au client final.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-disabled uppercase tracking-widest pl-1">
                                Seuil d'alerte stock faible
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full p-3 bg-bg-app/50 border-2 border-border-light rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-text-heading-tertiary"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                            />
                            <p className="text-[10px] text-text-disabled font-medium pl-1">
                                Vous recevrez une notification quand le stock descendra sous ce niveau.
                            </p>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 rounded-2xl"
                                onClick={handleClose}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-primary-hover shadow-lg shadow-primary/20 font-black"
                                isLoading={submitting}
                            >
                                Confirmer l'ajout
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};
