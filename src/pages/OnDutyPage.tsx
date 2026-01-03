import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';
import { pharmacyService } from '@/services/pharmacy.service';
import type { Pharmacy } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Link } from 'react-router-dom';

/**
 * Page affichant les pharmacies de garde actuelles.
 */
const OnDutyPage: React.FC = () => {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useNotificationStore();

    useEffect(() => {
        const fetchOnDuty = async () => {
            setLoading(true);
            try {
                const response = await pharmacyService.getOnDuty();
                setPharmacies(response.results);
            } catch (error) {
                addToast("Impossible de charger les pharmacies de garde", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchOnDuty();
        // Rafraîchir toutes les 5 minutes
        const interval = setInterval(fetchOnDuty, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [addToast]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3 flex items-center gap-4">
                        <div className="bg-amber-100 p-2 rounded-2xl text-amber-600">
                            <Clock size={32} />
                        </div>
                        Pharmacies de Garde
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl">
                        Liste des pharmacies ouvertes officiellement pour les urgences nocturnes, week-ends et jours fériés en Guinée.
                    </p>
                </div>
                <Badge variant="warning" className="px-4 py-2 text-sm font-black animate-pulse">
                    MIS À JOUR EN TEMPS RÉEL
                </Badge>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pharmacies.map((pharmacy) => (
                        <Card key={pharmacy.id} className="relative overflow-hidden border-amber-100 hover:border-amber-300">
                            {/* Décoration de garde */}
                            <div className="absolute top-0 right-0 p-4">
                                <Badge variant="warning" className="uppercase tracking-tighter">De Garde</Badge>
                            </div>

                            <CardContent className="pt-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 leading-tight truncate max-w-[200px]">
                                            {pharmacy.name}
                                        </h3>
                                        <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest gap-1">
                                            <MapPin size={12} />
                                            {pharmacy.city}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-2 text-slate-500 text-sm font-medium">
                                        <MapPin className="text-slate-300 shrink-0" size={18} />
                                        <p className="line-clamp-2">{pharmacy.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <Phone className="text-slate-300 shrink-0" size={18} />
                                        <p>{pharmacy.phone}</p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-amber-600 tracking-widest">Temps Restant</span>
                                        <span className="text-lg font-black text-amber-900 tracking-tight">Fin dans ~2h</span>
                                    </div>
                                    <Clock className="text-amber-200" size={32} />
                                </div>
                            </CardContent>

                            <CardFooter className="flex gap-3">
                                <Link to={`/pharmacy/${pharmacy.id}`} className="flex-1">
                                    <Button variant="outline" size="md" className="w-full">Détails</Button>
                                </Link>
                                <Button variant="primary" size="md" className="bg-emerald-600 hover:bg-emerald-700">
                                    <Phone size={18} className="mr-2" />
                                    Appeler
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && pharmacies.length === 0 && (
                <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
                    <div className="bg-white h-20 w-20 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Aucune pharmacie de garde</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        Il n'y a actuellement aucune pharmacie de garde répertoriée pour cette période.
                        Vérifiez plus tard ou contactez le service d'urgence.
                    </p>
                    <Link to="/recherche">
                        <Button variant="outline" size="lg" className="mt-8">Voir les pharmacies ouvertes</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OnDutyPage;
