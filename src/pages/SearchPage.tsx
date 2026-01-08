import React, { useState, useEffect, useCallback } from 'react';
import { Search, Map as MapIcon, List, Navigation2, Clock } from 'lucide-react';
import { pharmacyService } from '@/services/pharmacy.service';
import type { Pharmacy, SearchParams } from '@/types';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNotificationStore } from '@/store/notificationStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import MapView from '@/components/Map/MapView';
import { cn } from '@/utils/cn';
import { useLocationStore } from '@/store/locationStore';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';

/**
 * Page de recherche avancée des pharmacies.
 */
const SearchPage: React.FC = () => {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
    const [filters, setFilters] = useState<SearchParams>({
        search: '',
        on_duty: false,
        is_open: false,
    });

    const { getCurrentLocation, loading: geoLoading } = useGeolocation();
    const { addToast } = useNotificationStore();
    const { setUserCoords, setSelectedPharmacy, selectedPharmacyId, userCoords } = useLocationStore();

    // Trigger initial geolocation if not already known
    useEffect(() => {
        if (!userCoords) {
            getCurrentLocation().then(coords => {
                setUserCoords({ latitude: coords.latitude, longitude: coords.longitude });
            }).catch(console.error);
        }
    }, [userCoords, getCurrentLocation, setUserCoords]);

    const processedPharmacies = React.useMemo(() => {
        // Filter: Must be verified AND have GPS coordinates
        const validPharmacies = pharmacies.filter(p => p.is_verified && p.latitude && p.longitude);

        if (!userCoords) return validPharmacies;

        return validPharmacies.map(p => {
            const dist = calculateDistance(
                userCoords.latitude, userCoords.longitude,
                Number(p.latitude), Number(p.longitude)
            );
            return { ...p, distance: dist };
        }).sort((a, b) => {
            if (a.distance != null && b.distance != null) return a.distance - b.distance;
            if (a.distance != null) return -1;
            if (b.distance != null) return 1;
            return 0;
        });
    }, [pharmacies, userCoords]);

    const fetchPharmacies = useCallback(async (searchParams: SearchParams) => {
        setLoading(true);
        try {
            const response = await pharmacyService.getAll(searchParams);
            setPharmacies(response.results);
        } catch (error) {
            addToast("Erreur lors de la récupération des pharmacies", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchPharmacies(filters);
    }, [filters, fetchPharmacies]);

    const handleNearMe = async () => {
        setLoading(true);
        try {
            const coords = await getCurrentLocation();
            setUserCoords({ latitude: coords.latitude, longitude: coords.longitude });

            const response = await pharmacyService.getNearby(coords.latitude, coords.longitude);
            setPharmacies(response.results);
            setViewMode('map');
            addToast(`${response.results.length} pharmacies trouvées à proximité`, "success");
        } catch (error: any) {
            addToast(error || "Erreur lors de la recherche à proximité", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)]">
            {/* Header / Filtres */}
            <div className="bg-white border-b border-slate-100 p-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, ville ou adresse..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-slate-700"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant={filters.on_duty ? 'primary' : 'outline'}
                            size="md"
                            className="flex-1 md:flex-none gap-2 rounded-2xl"
                            onClick={() => setFilters({ ...filters, on_duty: !filters.on_duty })}
                        >
                            <Clock size={18} />
                            De Garde
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            className="flex-1 md:flex-none gap-2 rounded-2xl bg-slate-900 border-slate-900 hover:bg-slate-800"
                            onClick={handleNearMe}
                            isLoading={geoLoading}
                        >
                            <Navigation2 size={18} />
                            Proche de moi
                        </Button>
                        <div className="hidden md:flex bg-slate-100 p-1 rounded-2xl">
                            <button
                                onClick={() => setViewMode('map')}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    viewMode === 'map' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <MapIcon size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    viewMode === 'list' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu Principal */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Liste (Sidebar sur Desktop) */}
                <div className={cn(
                    "flex-none w-full md:w-[400px] bg-slate-50 border-r border-slate-100 overflow-y-auto p-4 transition-all",
                    viewMode === 'map' && "hidden md:block"
                )}>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                {loading ? 'Chargement...' : `${pharmacies.length} Résultats`}
                            </p>
                            <div className="flex gap-1">
                                <Badge variant="outline" className="bg-white">Tri par défaut</Badge>
                            </div>
                        </div>

                        {processedPharmacies.map((pharmacy) => (
                            <Card
                                key={pharmacy.id}
                                className={cn(
                                    "cursor-pointer group transition-all duration-300",
                                    selectedPharmacyId === pharmacy.id ? "ring-2 ring-emerald-500 shadow-emerald-100" : "hover:shadow-md"
                                )}
                                onClick={() => setSelectedPharmacy(pharmacy.id, pharmacy.name)}
                            >
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                                            {pharmacy.name}
                                        </h3>
                                        <div className="flex gap-1 flex-shrink-0">
                                            {selectedPharmacyId === pharmacy.id && (
                                                <Badge variant="success" className="bg-emerald-500 text-white border-0">SÉLECTIONNÉE</Badge>
                                            )}
                                            {pharmacy.is_on_duty_now && <Badge variant="warning">GARDE</Badge>}
                                            <Badge variant={pharmacy.is_open_now ? 'success' : 'error'}>
                                                {pharmacy.is_open_now ? 'OUVERT' : 'FERMÉ'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">
                                        {pharmacy.address}, {pharmacy.city}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs font-bold text-slate-400">{pharmacy.phone}</span>
                                        {pharmacy.distance != null && (
                                            <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-100">
                                                <Navigation2 size={10} className="mr-1 fill-current" />
                                                {formatDistance(Number(pharmacy.distance))}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {!loading && pharmacies.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-400 font-bold">Aucune pharmacie trouvée</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Carte */}
                <div className={cn(
                    "flex-1 relative",
                    viewMode === 'list' && "hidden md:block"
                )}>
                    <MapView
                        pharmacies={processedPharmacies}
                        className="h-full rounded-none"
                        userLocation={userCoords ? [userCoords.latitude, userCoords.longitude] : undefined}
                        center={userCoords ? [userCoords.latitude, userCoords.longitude] : [9.509, -13.712]}
                    />

                    {/* Bouton Toggle Mobile */}
                    <button
                        onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 md:hidden z-[1000] bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
                    >
                        {viewMode === 'map' ? <List size={20} /> : <MapIcon size={20} />}
                        {viewMode === 'map' ? 'Voir Liste' : 'Voir Carte'}
                    </button>

                    {loading && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[1001] flex items-center justify-center">
                            <div className="bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-4">
                                <div className="h-6 w-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <span className="font-bold text-slate-800">Recherche en cours...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
