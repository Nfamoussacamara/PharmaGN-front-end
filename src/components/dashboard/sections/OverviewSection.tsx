import React from 'react';
import type { Order, Stock } from '@/types';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { StockAlerts } from '@/components/dashboard/StockAlerts';
import { Clock, AlertTriangle, TrendingUp, Calendar, Sparkles, Package, Truck, XCircle } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import { StatsChart } from '@/components/dashboard/StatsChart';
import { TopSellingMedications } from '@/components/dashboard/TopSellingMedications';
import { CriticalAlerts } from '@/components/dashboard/CriticalAlerts';
import { StockWidgets } from '@/components/dashboard/StockWidgets';
import { QuickActionsBar } from '@/components/dashboard/QuickActionsBar';
import { SystemFooter } from '@/components/dashboard/SystemFooter';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/format';

interface OverviewSectionProps {
    orders: Order[];
    lowStocks: Stock[];
    stats: any;
    loading: boolean;
    onRefresh: () => void;
    onOrderClick: (order: Order) => void;
}

/**
 * Section Vue d'ensemble du dashboard
 */
export const OverviewSection: React.FC<OverviewSectionProps> = ({
    orders,
    lowStocks,
    stats,
    loading,
    onRefresh,
    onOrderClick
}) => {
    const { user } = useAuthStore();

    // Données fictives pour les alertes stratégiques
    const strategicAlerts = [
        {
            id: '1',
            type: 'urgent' as const,
            title: 'Rupture: Amoxicilline 1g',
            message: 'Produit essentiel en rupture de stock. 12 commandes en attente.',
            actionLabel: 'Réapprovisionner'
        },
        {
            id: '2',
            type: 'important' as const,
            title: 'Expirations (18)',
            message: '18 produits expirent dans moins de 30 jours. Action requise.',
            actionLabel: 'Voir la liste'
        },
        {
            id: '3',
            type: 'info' as const,
            title: 'Stock optimal atteint',
            message: 'Le réapprovisionnement de Paracétamol est arrivé.',
            actionLabel: 'Vérifier'
        },
    ];

    // Données de graphique fictives pour la démo
    const revenueData = [
        { label: 'Lun', value: 1200000 },
        { label: 'Mar', value: 950000 },
        { label: 'Mer', value: 1500000 },
        { label: 'Jeu', value: 1800000 },
        { label: 'Ven', value: 1400000 },
        { label: 'Sam', value: 2100000 },
        { label: 'Dim', value: 1950000 },
    ];

    // Préparation des données pour le composant DashboardStats (6 KPI stratégiques)
    const statCards = [
        {
            label: 'Commandes',
            value: stats?.total_orders_today || 0,
            icon: <Package className="text-primary" size={18} />,
            bg: 'bg-primary/10',
            gradient: 'bg-gradient-to-br from-primary/10 to-transparent',
            trend: { value: '12%', positive: true }
        },
        {
            label: 'CA Journalier',
            value: formatPrice(stats?.daily_revenue || 0),
            icon: <TrendingUp className="text-emerald-600" size={18} />,
            bg: 'bg-emerald-100/50',
            gradient: 'bg-gradient-to-br from-emerald-500/10 to-transparent',
            trend: { value: '18%', positive: true }
        },
        {
            label: 'En attente',
            value: stats?.pending_orders || 0,
            icon: <Clock className="text-amber-600" size={18} />,
            bg: 'bg-amber-100/50',
            gradient: 'bg-gradient-to-br from-amber-500/10 to-transparent',
            trend: { value: '2.5min', positive: true }
        },
        {
            label: 'En livraison',
            value: stats?.in_delivery || 0,
            icon: <Truck className="text-blue-600" size={18} />,
            bg: 'bg-blue-100/50',
            gradient: 'bg-gradient-to-br from-blue-500/10 to-transparent',
            trend: { value: '2 retards', positive: false }
        },
        {
            label: 'Annulations',
            value: stats?.cancelled_orders || 0,
            icon: <XCircle className="text-rose-600" size={18} />,
            bg: 'bg-rose-100/50',
            gradient: 'bg-gradient-to-br from-rose-500/10 to-transparent',
            trend: { value: '1.2%', positive: true }
        },
        {
            label: 'Stock Critique',
            value: lowStocks.filter(s => s.quantity === 0).length,
            icon: <AlertTriangle className="text-rose-600" size={18} />,
            bg: 'bg-rose-100/50',
            gradient: 'bg-gradient-to-br from-rose-500/10 to-transparent',
            trend: { value: 'Urgent', positive: false }
        },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header de bienvenue */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amber-400" size={16} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vue d'ensemble</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-3">
                        Bonjour, <span className="text-primary">{user?.first_name || 'Pharmacien'}</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm">
                        Voici le résumé de l'activité de votre pharmacie pour aujourd'hui.
                    </p>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <Calendar className="text-primary" size={18} />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest leading-none">
                        {formatDate(new Date().toISOString())}
                    </span>
                </div>
            </div>

            {/* Cartes Statistiques */}
            <DashboardStats stats={statCards} loading={loading} />

            {/* Alertes Critiques (Nouveau Bloc Stratégique) */}
            <CriticalAlerts alerts={strategicAlerts} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Colonne de gauche: Commandes et Graphique */}
                <div className="lg:col-span-2 space-y-8">
                    <StatsChart
                        data={revenueData}
                        title="Activité Commerciale"
                        color="#10b981"
                    />

                    <RecentOrders
                        orders={orders}
                        loading={loading}
                        onRefresh={onRefresh}
                        onOrderClick={onOrderClick}
                    />
                </div>

                {/* Colonne de droite: Alertes Stock et Top Ventes */}
                <div className="space-y-10">
                    <TopSellingMedications />

                    <StockWidgets
                        inventoryValue={45000000}
                        totalProducts={1247}
                        expirations={{ urgent: 3, upcoming: 18 }}
                    />

                    <StockAlerts lowStocks={lowStocks} loading={loading} />
                </div>
            </div>

            {/* Footer Intelligent */}
            <SystemFooter />

            {/* Barre d'Actions Rapides Flottante */}
            <QuickActionsBar />
        </div>
    );
};
