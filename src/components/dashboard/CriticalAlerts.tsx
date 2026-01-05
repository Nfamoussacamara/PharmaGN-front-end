import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Alert {
    id: string;
    type: 'urgent' | 'important' | 'info';
    title: string;
    message: string;
    actionLabel?: string;
}

interface CriticalAlertsProps {
    alerts: Alert[];
    onDismiss?: (id: string) => void;
    onAction?: (alert: Alert) => void;
}

export const CriticalAlerts: React.FC<CriticalAlertsProps> = ({
    alerts,
    onDismiss,
    onAction
}) => {
    if (alerts.length === 0) return null;

    const getAlertStyles = (type: Alert['type']) => {
        switch (type) {
            case 'urgent':
                return {
                    container: "bg-rose-50 border-rose-100 text-rose-800",
                    icon: <AlertCircle size={18} className="text-rose-600" />,
                    badge: "bg-rose-600 text-white",
                    action: "text-rose-700 hover:bg-rose-100"
                };
            case 'important':
                return {
                    container: "bg-amber-50 border-amber-100 text-amber-800",
                    icon: <AlertTriangle size={18} className="text-amber-600" />,
                    badge: "bg-amber-600 text-white",
                    action: "text-amber-700 hover:bg-amber-100"
                };
            case 'info':
                return {
                    container: "bg-blue-50 border-blue-100 text-blue-800",
                    icon: <Info size={18} className="text-blue-600" />,
                    badge: "bg-blue-600 text-white",
                    action: "text-blue-700 hover:bg-blue-100"
                };
        }
    };

    return (
        <div className="space-y-3 mb-10">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    Alertes Critiques
                    <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                        {alerts.length}
                    </span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {alerts.map((alert) => {
                        const styles = getAlertStyles(alert.type);
                        return (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                className={cn(
                                    "relative p-4 rounded-[24px] border border-transparent transition-all group",
                                    styles.container
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className="shrink-0 pt-0.5">
                                        {styles.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm mb-1 truncate">{alert.title}</h4>
                                        <p className="text-[11px] font-medium leading-relaxed opacity-80 line-clamp-2">
                                            {alert.message}
                                        </p>

                                        {alert.actionLabel && (
                                            <button
                                                onClick={() => onAction?.(alert)}
                                                className={cn(
                                                    "mt-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 py-1.5 px-3 rounded-xl transition-colors",
                                                    styles.action
                                                )}
                                            >
                                                {alert.actionLabel}
                                                <ChevronRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                    {onDismiss && (
                                        <button
                                            onClick={() => onDismiss?.(alert.id)}
                                            className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors shrink-0"
                                        >
                                            <X size={14} className="opacity-40" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
