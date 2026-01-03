import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Store,
    BarChart3
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

interface DashboardSidebarProps {
    activeSection?: string;
    onSectionChange?: (sectionId: string) => void;
}

/**
 * Sidebar de navigation pour le tableau de bord pharmacien
 */
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    activeSection = 'overview',
    onSectionChange
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems: SidebarItem[] = [
        {
            id: 'overview',
            label: 'Vue d\'ensemble',
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: 'orders',
            label: 'Commandes',
            icon: <ClipboardList size={20} />,
        },
        {
            id: 'stock',
            label: 'Gestion Stock',
            icon: <Package size={20} />,
        },
        {
            id: 'pharmacy',
            label: 'Ma Pharmacie',
            icon: <Store size={20} />,
        },
        {
            id: 'analytics',
            label: 'Statistiques',
            icon: <BarChart3 size={20} />,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <Bell size={20} />,
        },
        {
            id: 'settings',
            label: 'Paramètres',
            icon: <Settings size={20} />,
        },
    ];

    const handleItemClick = (itemId: string) => {
        onSectionChange?.(itemId);
    };

    return (
        <motion.aside
            className={cn(
                "h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Store className="text-white" size={18} />
                            </div>
                            <div>
                                <p className="font-black text-sm text-slate-900">PharmaGN</p>
                                <p className="text-[10px] text-slate-500 font-medium">Pharmacien</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                >
                    {isCollapsed ? (
                        <ChevronRight size={16} className="text-slate-600" />
                    ) : (
                        <ChevronLeft size={16} className="text-slate-600" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => {
                    const isActive = activeSection === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                isActive
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={cn(
                                "shrink-0",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-600"
                            )}>
                                {item.icon}
                            </div>

                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-sm font-bold truncate"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active indicator */}
                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer - Version collapse indicator */}
            {!isCollapsed && (
                <motion.div
                    className="p-4 border-t border-slate-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-medium">
                            PharmaGN Dashboard v1.0
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.aside>
    );
};
