import React, { useState, useEffect } from 'react';
import { Store, Edit2, Save } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Section d'informations et de gestion de la pharmacie
 */
export const PharmacyInfoSection: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const { addToast } = useNotificationStore();
    const [pharmacyData, setPharmacyData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        license_number: '',
        opening_hours: ''
    });

    useEffect(() => {
        if (user?.pharmacy) {
            fetchPharmacyData();
        }
    }, [user]);

    const fetchPharmacyData = async () => {
        if (!user?.pharmacy) return;
        setLoading(true);
        try {
            const response = await apiClient.get(`/pharmacies/${user.pharmacy}/`);
            if (response.data) {
                // S'assurer que opening_hours est une chaîne pour le textarea si c'est un objet
                const data = response.data;
                if (data.opening_hours && typeof data.opening_hours === 'object') {
                    data.opening_hours = JSON.stringify(data.opening_hours, null, 2);
                }
                setPharmacyData(data);
            }
        } catch (error) {
            console.error('Failed to fetch pharmacy data:', error);
            addToast("Erreur lors du chargement des informations", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.pharmacy) return;
        setLoading(true);
        try {
            const dataToSave = { ...pharmacyData };
            // Tenter de parser opening_hours en JSON si c'est une chaîne valide
            try {
                if (typeof dataToSave.opening_hours === 'string' && dataToSave.opening_hours.trim().startsWith('{')) {
                    dataToSave.opening_hours = JSON.parse(dataToSave.opening_hours);
                }
            } catch (e) {
                // Si ce n'est pas du JSON valide, on le laisse en string (le backend gérera ou rejettera selon sa config)
                console.warn("Opening hours is not valid JSON, sending as string");
            }

            await apiClient.patch(`/pharmacies/${user.pharmacy}/`, dataToSave);
            addToast("Informations mises à jour", "success");
            setIsEditing(false);
            fetchPharmacyData(); // Rafraîchir pour avoir le format propre
        } catch (error) {
            addToast("Erreur lors de la sauvegarde", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !pharmacyData.name) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Store size={28} className="text-emerald-600" />
                        Ma Pharmacie
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Gérez les informations de votre établissement
                    </p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} leftIcon={<Edit2 size={18} />}>
                        Modifier
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSave}
                            isLoading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Enregistrer
                        </Button>
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <Card className="p-6">
                    <h3 className="text-lg font-black text-slate-900 mb-4">Informations Générales</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Nom de la pharmacie
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.name}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, name: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium">{pharmacyData.name || 'Non renseigné'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Numéro de licence
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.license_number}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, license_number: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium font-mono">{pharmacyData.license_number || 'Non renseigné'}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Contact Info */}
                <Card className="p-6">
                    <h3 className="text-lg font-black text-slate-900 mb-4">Coordonnées</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Téléphone
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.phone}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, phone: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium">{pharmacyData.phone || 'Non renseigné'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.email}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, email: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium">{pharmacyData.email || 'Non renseigné'}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Address */}
                <Card className="p-6">
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                        Adresse
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Rue
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.address}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, address: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium">{pharmacyData.address || 'Non renseigné'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                                Ville
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    value={pharmacyData.city}
                                    onChange={(e) => setPharmacyData({ ...pharmacyData, city: e.target.value })}
                                />
                            ) : (
                                <p className="text-slate-900 font-medium">{pharmacyData.city || 'Non renseigné'}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Hours */}
                <Card className="p-6">
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                        Horaires d'ouverture
                    </h3>
                    <div>
                        {isEditing ? (
                            <textarea
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 min-h-[100px] font-mono text-sm"
                                placeholder='Format: {"lundi": {"open": "08:00", "close": "20:00"}}'
                                value={typeof pharmacyData.opening_hours === 'string'
                                    ? pharmacyData.opening_hours
                                    : JSON.stringify(pharmacyData.opening_hours, null, 2)}
                                onChange={(e) => setPharmacyData({ ...pharmacyData, opening_hours: e.target.value })}
                            />
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[60px] flex flex-col justify-center">
                                {(() => {
                                    const hours = pharmacyData.opening_hours;

                                    // Cas où c'est vide
                                    if (!hours || (typeof hours === 'object' && Object.keys(hours).length === 0) || hours === '{}') {
                                        return <p className="text-slate-400 italic text-center">Non renseigné</p>;
                                    }

                                    // Cas où c'est une chaîne (déjà formatée ou JSON brut)
                                    if (typeof hours === 'string') {
                                        try {
                                            // Si c'est du JSON en chaîne, on tente de le parser pour le formater
                                            if (hours.trim().startsWith('{')) {
                                                const parsed = JSON.parse(hours);
                                                return Object.entries(parsed).map(([day, times]: [string, any]) => (
                                                    <div key={day} className="flex justify-between py-1 border-b border-slate-200 last:border-0 hover:bg-slate-100/50 px-2 rounded-lg transition-colors">
                                                        <span className="capitalize font-bold text-slate-600">{day}</span>
                                                        <span className="text-emerald-700 font-bold">{times.open} - {times.close}</span>
                                                    </div>
                                                ));
                                            }
                                            return <p className="text-slate-900 font-medium whitespace-pre-line text-sm">{hours}</p>;
                                        } catch (e) {
                                            return <p className="text-slate-900 font-medium whitespace-pre-line text-sm">{hours}</p>;
                                        }
                                    }

                                    // Cas où c'est un objet
                                    return Object.entries(hours).map(([day, times]: [string, any]) => (
                                        <div key={day} className="flex justify-between py-1 border-b border-slate-200 last:border-0 hover:bg-slate-100/50 px-2 rounded-lg transition-colors">
                                            <span className="capitalize font-bold text-slate-600">{day}</span>
                                            <span className="text-emerald-700 font-bold">{times.open} - {times.close}</span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
