import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { orderService } from '@/services/order.service';
import apiClient from '@/services/apiClient';
import type { Order, Stock } from '@/types';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';

// Nouveaux composants modulaires
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { OrderDetailsModal } from '@/components/dashboard/OrderDetailsModal';

// Sections
import { OverviewSection } from '@/components/dashboard/sections/OverviewSection';
import { OrdersSection } from '@/components/dashboard/sections/OrdersSection';
import { StockManagementSection } from '@/components/dashboard/sections/StockManagementSection';
import { PharmacyInfoSection } from '@/components/dashboard/sections/PharmacyInfoSection';
import { NotificationsSection } from '@/components/dashboard/sections/NotificationsSection';
import { SettingsSection } from '@/components/dashboard/sections/SettingsSection';
import { AnalyticsSection } from '@/components/dashboard/sections/AnalyticsSection';

/**
 * Dashboard principal pour les pharmaciens.
 */
const PharmacistDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [lowStocks, setLowStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [activeSection, setActiveSection] = useState('overview');

    const { addToast } = useNotificationStore();
    const { user } = useAuthStore();

    const fetchDashboardData = async () => {
        if (!user?.pharmacy) return;
        setLoading(true);
        try {
            // 1. Récupérer les commandes en attente via l'endpoint spécialisé
            const ordersResponse = await apiClient.get<Order[]>('/dashboard/orders_pending/');
            setOrders(ordersResponse.data);

            // 2. Récupérer les statistiques journalières
            const statsResponse = await apiClient.get<any>('/dashboard/stats_daily/');
            setStats(statsResponse.data);

            // 3. Récupérer les stocks bas
            const stocksResponse = await apiClient.get<Stock[]>('/dashboard/stock_low/');
            setLowStocks(stocksResponse.data);

        } catch (error) {
            addToast("Erreur lors du chargement du dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleValidate = async (orderId: number) => {
        try {
            await orderService.updateStatus(orderId, 'validate');
            addToast("Commande validée", "success");
            fetchDashboardData();
            setSelectedOrder(null);
        } catch (error) {
            addToast("Erreur lors de la validation", "error");
        }
    };

    const handleReject = async (orderId: number, reason: string) => {
        try {
            await orderService.updateStatus(orderId, 'reject', { rejection_reason: reason });
            addToast("Commande rejetée", "info");
            fetchDashboardData();
            setSelectedOrder(null);
        } catch (error) {
            addToast("Erreur lors du rejet", "error");
        }
    };

    const handleComplete = async (orderId: number) => {
        try {
            await orderService.updateStatus(orderId, 'complete');
            addToast("Commande marquée comme récupérée", "success");
            fetchDashboardData();
            setSelectedOrder(null);
        } catch (error) {
            addToast("Erreur lors de la finalisation", "error");
        }
    };

    // Fonction pour rendre la section active
    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <OverviewSection
                        orders={orders}
                        lowStocks={lowStocks}
                        stats={stats}
                        loading={loading}
                        onRefresh={fetchDashboardData}
                        onOrderClick={setSelectedOrder}
                    />
                );
            case 'orders':
                return <OrdersSection onOrderClick={setSelectedOrder} />;
            case 'stock':
                return <StockManagementSection />;
            case 'pharmacy':
                return <PharmacyInfoSection />;
            case 'analytics':
                return <AnalyticsSection />;
            case 'notifications':
                return <NotificationsSection />;
            case 'settings':
                return <SettingsSection />;
            default:
                return (
                    <OverviewSection
                        orders={orders}
                        lowStocks={lowStocks}
                        stats={stats}
                        loading={loading}
                        onRefresh={fetchDashboardData}
                        onOrderClick={setSelectedOrder}
                    />
                );
        }
    };

    // Titre de la section
    const getSectionTitle = () => {
        const titles: Record<string, string> = {
            overview: 'Tableau de Bord',
            orders: 'Commandes',
            stock: 'Gestion du Stock',
            pharmacy: 'Ma Pharmacie',
            analytics: 'Statistiques',
            notifications: 'Notifications',
            settings: 'Paramètres',
        };
        return titles[activeSection] || 'Tableau de Bord';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <DashboardSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            {/* Main Content */}
            <motion.div
                className="flex-1 overflow-y-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                    {/* En-tête du Dashboard */}
                    <motion.div
                        className="flex items-center gap-4 mb-10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-3 rounded-2xl text-white shadow-xl">
                            <LayoutDashboard size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                {getSectionTitle()}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeSection === 'overview'
                                    ? 'Gérez vos stocks et validez les réservations entrantes.'
                                    : 'Gérez votre activité pharmaceutique'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Section Content */}
                    {renderSection()}

                    {/* Modal de Détails Commande */}
                    <OrderDetailsModal
                        order={selectedOrder}
                        isOpen={!!selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        onValidate={handleValidate}
                        onReject={handleReject}
                        onComplete={handleComplete}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default PharmacistDashboard;
