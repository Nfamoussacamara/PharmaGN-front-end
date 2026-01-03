import React, { useState, useEffect, useCallback } from 'react';
import { Search, Pill, Store, ChevronRight, Info } from 'lucide-react';
import { medicationService } from '@/services/medication.service';
import type { Medication, Stock } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatPrice } from '@/utils/format';

/**
 * Page de recherche de médicaments avec gestion du stock.
 */
const MedicationSearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loadingStock, setLoadingStock] = useState(false);
    const [orderDraft, setOrderDraft] = useState<{ med: Medication, stock: Stock } | null>(null);

    const { addToast } = useNotificationStore();

    const searchMedications = useCallback(async (q: string) => {
        if (q.length < 2) {
            setMedications([]);
            return;
        }
        setLoading(true);
        try {
            const response = await medicationService.getAll({ search: q });
            setMedications(response.results);
        } catch (error) {
            addToast("Erreur lors de la recherche", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        const timer = setTimeout(() => searchMedications(query), 500);
        return () => clearTimeout(timer);
    }, [query, searchMedications]);

    const handleSelectMedication = async (med: Medication) => {
        setSelectedMed(med);
        setLoadingStock(true);
        try {
            const availability = await medicationService.getAvailability(med.id);
            setStocks(availability);
        } catch (error) {
            addToast("Erreur lors de la récupération des stocks", "error");
        } finally {
            setLoadingStock(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                    Trouver un Médicament
                </h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">
                    Recherchez un médicament par son nom et vérifiez sa disponibilité dans les pharmacies de votre ville.
                </p>
            </div>

            {/* Barre de Recherche */}
            <div className="relative mb-12">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Search size={28} />
                </div>
                <input
                    type="text"
                    placeholder="Ex: Paracétamol, Amoxicilline..."
                    className="w-full pl-16 pr-6 py-6 rounded-[32px] bg-white border-none shadow-2xl shadow-emerald-900/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-xl text-slate-800 placeholder:text-slate-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <div className="h-6 w-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medications.map((med) => (
                    <Card key={med.id} className="group hover:border-emerald-200" onClick={() => handleSelectMedication(med)}>
                        <CardContent className="p-6 flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Pill size={32} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{med.name}</h3>
                                    <Badge variant={med.requires_prescription ? 'warning' : 'info'} className="text-[10px]">
                                        {med.requires_prescription ? 'ORDONNANCE' : 'OTC'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-medium line-clamp-1">{med.description}</p>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {query.length >= 2 && !loading && medications.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
                    <p className="text-slate-400 font-bold">Aucun médicament trouvé pour "{query}"</p>
                </div>
            )}

            {/* Modal de Disponibilité */}
            <Modal
                isOpen={!!selectedMed}
                onClose={() => setSelectedMed(null)}
                title={selectedMed?.name}
                size="lg"
            >
                {selectedMed && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                            <Info className="text-slate-400 shrink-0" size={20} />
                            <div>
                                <p className="text-sm text-slate-600 font-medium">{selectedMed.description}</p>
                                <div className="flex gap-2 mt-3">
                                    <Badge variant="outline">ATC: {selectedMed.atc_code || 'N/A'}</Badge>
                                    <Badge variant="outline">Fabricant: {selectedMed.manufacturer}</Badge>
                                </div>
                            </div>
                        </div>

                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Pharmacies Stockant ce Médicament</h4>

                        {loadingStock ? (
                            <div className="flex justify-center py-10">
                                <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stocks.map((stock) => (
                                    <div key={stock.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800">{stock.pharmacy_name}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Prix: {formatPrice(stock.unit_price)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={stock.quantity > 5 ? 'success' : 'warning'}>
                                                {stock.quantity} en stock
                                            </Badge>
                                            <Button
                                                size="sm"
                                                className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setOrderDraft({ med: selectedMed, stock })}
                                            >
                                                Réserver
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {stocks.length === 0 && (
                                    <p className="text-center py-6 text-slate-400 font-medium italic">
                                        Désolé, ce médicament n'est actuellement disponible dans aucune pharmacie.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal de Workflow de Commande */}
            <Modal
                isOpen={!!orderDraft}
                onClose={() => setOrderDraft(null)}
                title="Réservation"
                size="md"
            >
                {orderDraft && (
                    <OrderStepper
                        medication={orderDraft.med}
                        stock={orderDraft.stock}
                        onComplete={() => {
                            addToast("Commande confirmée !", "success");
                            // On garde la modal ouverte sur l'écran de succès pour l'instant
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

import { OrderStepper } from '@/components/Order/OrderStepper';

export default MedicationSearchPage;
