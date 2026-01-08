import React from 'react';
import type { Order, Stock } from '@/types';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { Clock, AlertTriangle, TrendingUp, Calendar, Sparkles, Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/utils/format';
import { StatsChart } from '@/components/dashboard/StatsChart';

import { BestSellersChart } from '@/components/dashboard/BestSellersChart';
import { SystemFooter } from '@/components/dashboard/SystemFooter';
import { useAuthStore } from '@/store/authStore';

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
    onOrderClick
}) => {
    const { user } = useAuthStore();



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

    // Préparation des données pour le composant DashboardStats (4 KPI stratégiques)
    const statCards = [
        {
            label: 'Commandes',
            value: stats?.total_orders_today || 0,
            icon: <Package className="text-blue-600" size={18} />,
            bg: 'bg-blue-100/50',
            gradient: 'bg-gradient-to-br from-blue-500/10 to-transparent',
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
            icon: <Clock className="text-violet-600" size={18} />,
            bg: 'bg-violet-100/50',
            gradient: 'bg-gradient-to-br from-violet-500/10 to-transparent',
            trend: { value: '2.5min', positive: true }
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
        <div className="space-y-6 pb-6">
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

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StatsChart
                        data={revenueData}
                        title="Activité Commerciale"
                        color="#10b981"
                    />
                    <BestSellersChart loading={loading} />
                </div>

                <RecentOrders
                    orders={orders}
                    loading={loading}
                    onOrderClick={onOrderClick}
                />
            </div>

            {/* Footer Intelligent */}
            <SystemFooter />


        </div>
    );
};
