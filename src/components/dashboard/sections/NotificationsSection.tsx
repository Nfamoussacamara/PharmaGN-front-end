import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDate } from '@/utils/format';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Section de gestion des notifications
 */
export const NotificationsSection: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);
    const { addToast } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<any>('/notifications/');
            const data = response.data;
            // Gérer le cas où l'API renvoie un objet paginé { results: [], ... } 
            // ou un tableau simple []
            setNotifications(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
            addToast("Erreur lors du chargement des notifications", "error");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await apiClient.patch(`/notifications/${id}/`, { is_read: true });
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            addToast("Erreur", "error");
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await apiClient.delete(`/notifications/${id}/`);
            setNotifications(notifications.filter(n => n.id !== id));
            addToast("Notification supprimée", "success");
        } catch (error) {
            addToast("Erreur lors de la suppression", "error");
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.is_read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getNotificationIcon = (_type: string) => {
        // Retourner différentes icônes selon le type
        return <Bell size={20} />;
    };

    const getNotificationColor = (type: string) => {
        const colors: Record<string, string> = {
            order: 'border-l-emerald-500',
            stock: 'border-l-rose-500',
            system: 'border-l-blue-500',
        };
        return colors[type] || 'border-l-slate-300';
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Bell size={28} className="text-emerald-600" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge variant="error" className="ml-2">
                                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Gérez vos alertes et notifications
                    </p>
                </div>
                <Button onClick={fetchNotifications} size="sm">
                    Actualiser
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    Toutes ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unread'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    Non lues ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-xl" />
                    ))
                ) : filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="mx-auto mb-4 text-slate-300" size={48} />
                        <p className="text-slate-500 font-medium">
                            {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                        </p>
                    </Card>
                ) : (
                    <AnimatePresence>
                        {filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                layout
                            >
                                <Card
                                    className={`border-l-4 ${getNotificationColor(notif.type)} ${notif.is_read ? 'bg-white' : 'bg-blue-50/30'
                                        }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-3 flex-1">
                                                <div className={`shrink-0 p-2 rounded-lg ${notif.is_read ? 'bg-slate-100' : 'bg-emerald-100'
                                                    }`}>
                                                    {getNotificationIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-slate-900 text-sm">
                                                        {notif.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-2">
                                                        {formatDate(notif.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                {!notif.is_read && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => markAsRead(notif.id)}
                                                        title="Marquer comme lu"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteNotification(notif.id)}
                                                    title="Supprimer"
                                                    className="text-rose-600 hover:text-rose-700"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};
