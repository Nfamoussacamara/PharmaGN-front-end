import React from 'react';
import type { Order, Stock } from '@/types';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { StockAlerts } from '@/components/dashboard/StockAlerts';
import { Clock, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/utils/format';

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
    // Préparation des données pour le composant DashboardStats
    const statCards = [
        {
            label: 'En attente',
            value: stats?.pending_orders || 0,
            icon: <Clock className="text-amber-500" size={20} />,
            bg: 'bg-amber-50',
            gradient: 'bg-gradient-to-br from-amber-500/5 to-transparent'
        },
        {
            label: 'Stocks Bas',
            value: lowStocks.length,
            icon: <AlertTriangle className="text-rose-500" size={20} />,
            bg: 'bg-rose-50',
            gradient: 'bg-gradient-to-br from-rose-500/5 to-transparent'
        },
        {
            label: 'CA du Jour',
            value: formatPrice(stats?.daily_revenue || 0),
            icon: <TrendingUp className="text-emerald-500" size={20} />,
            bg: 'bg-emerald-50',
            gradient: 'bg-gradient-to-br from-emerald-500/5 to-transparent'
        },
        {
            label: 'Taux Val.',
            value: `${stats?.validation_rate || 0}%`,
            icon: <CheckCircle className="text-blue-500" size={20} />,
            bg: 'bg-blue-50',
            gradient: 'bg-gradient-to-br from-blue-500/5 to-transparent'
        },
    ];

    return (
        <>
            {/* Cartes Statistiques */}
            <DashboardStats stats={statCards} loading={loading} />

            {/* Grille principale: Commandes + Alertes Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Liste des Commandes Récentes (2/3) */}
                <RecentOrders
                    orders={orders}
                    loading={loading}
                    onRefresh={onRefresh}
                    onOrderClick={onOrderClick}
                />

                {/* Alertes Stock (1/3) */}
                <StockAlerts lowStocks={lowStocks} loading={loading} />
            </div>
        </>
    );
};
