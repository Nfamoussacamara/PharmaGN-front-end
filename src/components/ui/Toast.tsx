import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    info: <Info className="text-sky-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
};

const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-sky-50 border-sky-100',
    warning: 'bg-amber-50 border-amber-100',
};

/**
 * Conteneur global pour les toasts de notification.
 */
export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useNotificationStore();

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={cn(
                            'pointer-events-auto flex items-center min-w-[300px] max-w-md rounded-2xl border p-4 shadow-xl backdrop-blur-md',
                            bgColors[toast.type]
                        )}
                    >
                        <div className="flex-shrink-0">{icons[toast.type]}</div>
                        <div className="ml-3 mr-8 text-sm font-medium text-slate-800">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-white/50 hover:text-slate-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
