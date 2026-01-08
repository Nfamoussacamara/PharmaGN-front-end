import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, ShoppingCart, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiClient from '@/services/apiClient';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Section de gestion des notifications - Version Robuste
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

            // Gestion robuste du format de réponse (paginé ou non)
            let notifsArray: Notification[] = [];
            if (Array.isArray(data)) {
                notifsArray = data;
            } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
                notifsArray = data.results;
            }

            setNotifications(notifsArray);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
            // On n'affiche pas forcément de toast d'erreur ici pour éviter d'agacer l'utilisateur
            // si l'API n'est pas encore implémentée
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await apiClient.patch(`/notifications/${id}/`, { is_read: true });
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            addToast("Erreur lors de la mise à jour", "error");
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await apiClient.delete(`/notifications/${id}/`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            addToast("Notification supprimée", "success");
        } catch (error) {
            console.error("Error deleting notification:", error);
            addToast("Erreur lors de la suppression", "error");
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.is_read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getNotificationIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'order': return <ShoppingCart size={20} className="text-primary" />;
            case 'stock': return <AlertTriangle size={20} className="text-text-status-error" />;
            default: return <Info size={20} className="text-text-status-info" />;
        }
    };

    const getNotificationColor = (type: string) => {
        const colors: Record<string, string> = {
            order: 'border-l-primary',
            stock: 'border-l-bg-status-error',
            system: 'border-l-bg-status-info',
        };
        return colors[type?.toLowerCase()] || 'border-l-border-default';
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Action Bar */}
            <div className="flex items-center justify-between shrink-0 bg-bg-card/30 p-2 border border-border-light/50 backdrop-blur-sm">
                <div className="px-4">
                    <p className="text-text-body-secondary text-sm font-bold flex items-center gap-2">
                        <span className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            unreadCount > 0 ? "bg-primary animate-pulse" : "bg-emerald-500"
                        )} />
                        {unreadCount > 0
                            ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                            : "Aucune nouvelle notification"
                        }
                    </p>
                </div>
                <Button
                    onClick={fetchNotifications}
                    size="sm"
                    variant="ghost"
                    className="rounded-xl font-bold hover:bg-bg-hover"
                >
                    Actualiser
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-bg-secondary rounded-xl w-fit border border-border-light shadow-inner">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                        ? 'bg-bg-card text-text-heading-tertiary shadow-sm'
                        : 'text-text-body-secondary hover:text-text-heading-tertiary'
                        }`}
                >
                    Toutes ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unread'
                        ? 'bg-bg-card text-primary shadow-sm'
                        : 'text-text-body-secondary hover:text-text-heading-tertiary'
                        }`}
                >
                    Non lues ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Card className="p-16 text-center border-2 border-dashed border-border-light bg-transparent">
                        <div className="bg-bg-secondary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-text-disabled" size={32} />
                        </div>
                        <p className="text-text-body-secondary font-bold">
                            {filter === 'unread' ? 'Aucune notification non lue' : 'Votre boîte est vide'}
                        </p>
                    </Card>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id || Math.random()}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card
                                    className={`border-l-4 transition-all hover:bg-bg-hover ${getNotificationColor(notif.type)} ${notif.is_read ? 'opacity-80' : 'bg-primary/5'
                                        }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4 flex-1 min-w-0">
                                                <div className="shrink-0 mt-1">
                                                    {getNotificationIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-bold text-text-heading-tertiary text-base ${notif.is_read ? 'font-medium text-text-body-secondary' : ''}`}>
                                                        {notif.title || 'Notification'}
                                                    </h3>
                                                    <p className="text-sm text-text-body-secondary mt-1 line-clamp-2">
                                                        {notif.message || 'Pas de message'}
                                                    </p>
                                                    <p className="text-xs text-text-disabled mt-2 font-medium">
                                                        {notif.created_at ? formatDate(notif.created_at) : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-1 shrink-0">
                                                {!notif.is_read && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="text-primary hover:bg-primary-light"
                                                    >
                                                        <Check size={18} />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteNotification(notif.id)}
                                                    className="text-text-disabled hover:text-text-status-error hover:bg-bg-status-error/10"
                                                >
                                                    <Trash2 size={18} />
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
