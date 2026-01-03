import React, { useState } from 'react';
import { Upload, CheckCircle2, ShoppingCart, FileText, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { Medication, Stock, Order } from '@/types';
import { orderService } from '@/services/order.service';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/utils/format';

interface OrderStepperProps {
    medication: Medication;
    stock: Stock;
    onComplete: (order: Order) => void;
}

/**
 * Workflow de commande étape par étape.
 */
export const OrderStepper: React.FC<OrderStepperProps> = ({ medication, stock, onComplete }) => {
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

    const { addToast } = useNotificationStore();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleCreateOrder = async () => {
        setLoading(true);
        try {
            const order = await orderService.create({
                pharmacy: stock.pharmacy,
                medication: medication.id,
                quantity
            });
            setCreatedOrder(order);

            if (medication.requires_prescription) {
                setStep(3); // Aller vers l'upload
            } else {
                setStep(4); // Terminé directement pour OTC
                onComplete(order);
            }
        } catch (error) {
            addToast("Erreur lors de la réservation", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadPrescription = async () => {
        if (!prescriptionFile || !createdOrder) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('document', prescriptionFile);

        try {
            const updatedOrder = await orderService.uploadPrescription(createdOrder.id, formData);
            onComplete(updatedOrder);
            setStep(4);
        } catch (error) {
            addToast("Erreur lors de l'envoi de l'ordonnance", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-2">
            {/* Étapes Indicator */}
            <div className="flex items-center justify-between mb-10 px-4">
                {[1, 2, 3, 4].map((i) => (
                    <React.Fragment key={i}>
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full font-black text-sm border-2 transition-all",
                            step >= i ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-white border-slate-200 text-slate-300"
                        )}>
                            {step > i ? <CheckCircle2 size={20} /> : i}
                        </div>
                        {i < 4 && <div className={cn("h-0.5 flex-1 mx-2 rounded-full", step > i ? "bg-emerald-600" : "bg-slate-100")} />}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Quantité */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <ShoppingCart className="text-emerald-600" size={24} />
                        <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{medication.name}</p>
                            <p className="text-xs text-slate-500 font-bold tracking-tight">Prix Unitaire: {formatPrice(stock.unit_price)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 py-6">
                        <p className="font-bold text-slate-700">Choisissez la quantité :</p>
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xl hover:bg-slate-200"
                            >-</button>
                            <span className="text-4xl font-black text-slate-900">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(stock.quantity, quantity + 1))}
                                className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 font-bold text-xl hover:bg-emerald-200"
                            >+</button>
                        </div>
                        <p className="text-xs text-slate-400 font-bold">Max disponible: {stock.quantity}</p>
                    </div>

                    <div className="flex justify-between items-center p-6 bg-slate-900 rounded-3xl text-white">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Total à payer</p>
                            <p className="text-2xl font-black">{formatPrice(stock.unit_price * quantity)}</p>
                        </div>
                        <Button size="lg" className="rounded-2xl" onClick={handleNext} rightIcon={<ChevronRight size={18} />}>
                            Continuer
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Confirmation / Login needed check if not auth */}
            {step === 2 && (
                <div className="space-y-8 py-4">
                    <div className="text-center">
                        <h4 className="text-xl font-black text-slate-800 mb-2">Confirmer la Réservation</h4>
                        <p className="text-slate-500 font-medium">Le médicament sera réservé pour une durée de 2h.</p>
                    </div>

                    {medication.requires_prescription && (
                        <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800">
                            <AlertCircle className="shrink-0" />
                            <p className="text-sm font-bold">Ce médicament nécessite une ordonnance. Vous devrez l'uploader à l'étape suivante.</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-2xl" onClick={handleBack} leftIcon={<ChevronLeft size={18} />}>Retour</Button>
                        <Button variant="primary" className="flex-1 rounded-2xl" onClick={handleCreateOrder} isLoading={loading}>
                            Réserver maintenant
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Ordonnance */}
            {step === 3 && (
                <div className="space-y-6 py-4">
                    <div className="text-center">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h4 className="text-xl font-black text-slate-800 mb-2">Upload d'Ordonnance</h4>
                        <p className="text-slate-500 font-medium">Veuillez scanner ou prendre en photo votre ordonnance.</p>
                    </div>

                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                            <Upload size={40} className="mb-2" />
                            <p className="text-sm font-bold">{prescriptionFile ? prescriptionFile.name : 'Cliquez pour sélectionner un fichier'}</p>
                            <p className="text-xs mt-1">PNG, JPG ou PDF (Max 5MB)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                        />
                    </label>

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full rounded-2xl mt-4"
                        disabled={!prescriptionFile}
                        onClick={handleUploadPrescription}
                        isLoading={loading}
                    >
                        Envoyer l'ordonnance
                    </Button>
                </div>
            )}

            {/* Step 4: Terminé */}
            {step === 4 && (
                <div className="text-center py-10 space-y-6">
                    <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
                        <CheckCircle2 size={56} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">Réservation Réussie !</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        Votre commande <span className="text-slate-900 font-black">#{createdOrder?.id.toString().padStart(5, '0')}</span> a été transmise à la pharmacie.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-left">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase">Statut Actuel</span>
                            <Badge variant="info">EN ATTENTE VALIDATION</Badge>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                            {medication.requires_prescription
                                ? "Le pharmacien vérifie votre ordonnance. Vous recevrez une notification dès qu'elle sera validée."
                                : "Votre médicament est réservé. Vous avez 2 heures pour le récupérer en pharmacie."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
