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
    BarChart3,
    Home,
    LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    activeBgClass: string;
    activeTextClass: string;
    hoverBgClass: string;
}

interface DashboardSidebarProps {
    activeSection?: string;
    onSectionChange?: (sectionId: string) => void;
}

/**
 * Sidebar de navigation pour le tableau de bord pharmacien avec couleurs personnalisées et effets de survol
 */
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    activeSection = 'overview',
    onSectionChange
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);

    const menuItems: SidebarItem[] = [
        {
            id: 'overview',
            label: 'Vue d\'ensemble',
            icon: <LayoutDashboard size={20} />,
            colorClass: 'text-blue-600',
            activeBgClass: 'bg-blue-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-blue-50'
        },
        {
            id: 'orders',
            label: 'Commandes',
            icon: <ClipboardList size={20} />,
            colorClass: 'text-amber-600',
            activeBgClass: 'bg-amber-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-amber-50'
        },
        {
            id: 'stock',
            label: 'Gestion Stock',
            icon: <Package size={20} />,
            colorClass: 'text-emerald-600',
            activeBgClass: 'bg-emerald-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-emerald-50'
        },
        {
            id: 'analytics',
            label: 'Statistiques',
            icon: <BarChart3 size={20} />,
            colorClass: 'text-violet-600',
            activeBgClass: 'bg-violet-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-violet-50'
        },
        {
            id: 'pharmacy',
            label: 'Ma Pharmacie',
            icon: <Store size={20} />,
            colorClass: 'text-teal-600',
            activeBgClass: 'bg-teal-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-teal-50'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <Bell size={20} />,
            colorClass: 'text-rose-600',
            activeBgClass: 'bg-rose-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-rose-50'
        },
        {
            id: 'settings',
            label: 'Paramètres',
            icon: <Settings size={20} />,
            colorClass: 'text-slate-600',
            activeBgClass: 'bg-slate-600',
            activeTextClass: 'text-white',
            hoverBgClass: 'hover:bg-slate-100'
        },
    ];

    const handleItemClick = (itemId: string) => {
        onSectionChange?.(itemId);
    };

    return (
        <motion.aside
            className={cn(
                "h-full bg-bg-card border-r border-border-light flex flex-col transition-all duration-300 shadow-xl z-20",
                isCollapsed ? "w-20" : "w-64"
            )}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className={cn(
                "p-5 border-b border-border-light flex items-center",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-9 w-9 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Store className="text-text-on-primary" size={20} />
                            </div>
                            <div>
                                <p className="font-black text-sm text-text-heading-tertiary tracking-tight">PharmaGN</p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Pharmacien</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "p-2 hover:bg-bg-hover rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm border border-border-light bg-bg-card",
                        !isCollapsed && "ml-auto"
                    )}
                >
                    {isCollapsed ? (
                        <ChevronRight size={18} className="text-text-body-secondary" />
                    ) : (
                        <ChevronLeft size={18} className="text-text-body-secondary" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, index) => {
                    const isActive = activeSection === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={cn(
                                "w-full flex items-center rounded-2xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 relative",
                                isCollapsed ? "justify-center h-14 px-0" : "gap-4 px-4 py-3",
                                isActive
                                    ? cn(item.activeTextClass, "font-black")
                                    : cn("text-text-body-secondary hover:scale-[1.01] hover:bg-slate-50")
                            )}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Sliding Active Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebarActiveNav"
                                    className={cn(
                                        "absolute rounded-2xl -z-10 shadow-lg shadow-current/10",
                                        item.activeBgClass,
                                        isCollapsed ? "inset-y-1 inset-x-0 rounded-2xl" : "inset-0"
                                    )}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <div className={cn(
                                "shrink-0 transition-all duration-300 group-hover:scale-110 relative z-10",
                                isActive ? "text-white" : item.colorClass
                            )}>
                                {item.icon}
                            </div>

                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -5 }}
                                        className={cn(
                                            "text-sm tracking-tight truncate transition-colors duration-300 relative z-10",
                                            isActive ? "text-white" : item.colorClass,
                                            isActive ? "font-black" : "font-semibold"
                                        )}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active indicator dot */}
                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="activeIndicatorDot"
                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-sm relative z-10"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border-light space-y-2">
                <Link to="/" className={cn(
                    "w-full flex items-center transition-all duration-300 group hover:bg-slate-50 rounded-2xl",
                    isCollapsed ? "justify-center h-14 px-0" : "gap-4 px-4 py-3"
                )}>
                    <Home size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                    {!isCollapsed && <span className="text-sm font-bold text-text-body-secondary group-hover:text-text-heading-tertiary">Retour à l'accueil</span>}
                </Link>
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className={cn(
                        "w-full flex items-center transition-all duration-300 group hover:bg-rose-50 rounded-2xl",
                        isCollapsed ? "justify-center h-14 px-0" : "gap-4 px-4 py-3"
                    )}
                >
                    <LogOut size={20} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                    {!isCollapsed && <span className="text-sm font-bold text-text-body-secondary group-hover:text-rose-600">Déconnexion</span>}
                </button>
            </div>

            {/* Footer */}
            {!isCollapsed && (
                <motion.div
                    className="p-6 bg-bg-app/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-card border border-border-light rounded-full shadow-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-text-body-secondary font-bold">Système en ligne</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Version courte si replié */}
            {isCollapsed && (
                <div className="mt-auto p-4 flex justify-center border-t border-border-light">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
            )}
        </motion.aside>
    );
};
