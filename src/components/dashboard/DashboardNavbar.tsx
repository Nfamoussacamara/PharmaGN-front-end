import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock, Calendar, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const DashboardNavbar: React.FC = () => {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (date: Date) => {
        const d = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
        return d.replace('.', ''); // Enlever le point après le mois si présent
    };

    return (
        <div className="flex items-center justify-between px-8 py-4 bg-transparent border-b border-border-light/10">
            {/* Left side (Empty or Breadcrumbs) */}
            <div className="flex-1"></div>

            {/* Right side components */}
            <div className="flex items-center gap-6">
                {/* Quick Action Icons */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 bg-white border border-border-light rounded-xl hover:bg-slate-50 transition-all group">
                        <Mail size={20} className="text-text-body-secondary group-hover:text-primary" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </button>
                    <button className="relative p-2.5 bg-white border border-border-light rounded-xl hover:bg-slate-50 transition-all group">
                        <Bell size={20} className="text-text-body-secondary group-hover:text-primary" />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </button>
                </div>

                {/* Time/Date Pill */}
                <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-100/50 backdrop-blur-sm border border-border-light rounded-[18px]">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-text-muted" />
                        <span className="text-sm font-black text-text-heading-tertiary tracking-tight">
                            {formatTime(currentTime)}
                        </span>
                    </div>
                    <div className="h-4 w-px bg-border-light"></div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-text-muted" />
                        <span className="text-sm font-bold text-text-body-secondary">
                            {formatDate(currentTime)}
                        </span>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 border-l border-border-light/30">
                    <div className="relative">
                        <div className="h-11 w-11 rounded-full border-2 border-primary/20 p-0.5 group cursor-pointer hover:border-primary transition-all">
                            <div className="h-full w-full rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
                                {user?.first_name && user?.last_name
                                    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
                                    : user?.username?.slice(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <span className="text-sm font-black text-text-heading-tertiary group-hover:text-primary transition-colors">
                                {user?.first_name && user?.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user?.username || 'Pharmacien Admin'}
                            </span>
                            <ChevronDown size={14} className="text-primary hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[10px] font-bold text-text-disabled uppercase tracking-widest">
                            {user?.role_display || 'Admin'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
