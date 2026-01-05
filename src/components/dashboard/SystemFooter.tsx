import { Wifi, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';

export const SystemFooter: React.FC = () => {
    const { user } = useAuthStore();
    const now = new Date();

    return (
        <footer className="mt-20 pt-8 pb-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-300" />
                    Dernière synchro : {now.getHours()}:{now.getMinutes().toString().padStart(2, '0')}
                </div>
                <div className="flex items-center gap-2">
                    <UserCheck size={14} className="text-slate-300" />
                    {user?.role_display || 'Admin'} - Pharmacie Centrale
                </div>
            </div>

            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={14} />
                    Système Opérationnel
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                    <Wifi size={14} />
                    Connexion : Stable (4G)
                </div>
                <div className="text-slate-300">
                    v1.2.0-stable
                </div>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-6 ml-2">
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    );
};
