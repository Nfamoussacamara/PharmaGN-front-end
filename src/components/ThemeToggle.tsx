import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            {(['light', 'system', 'dark'] as const).map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                        relative p-1.5 rounded-full transition-all duration-300
                        ${theme === t ? 'text-primary dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
                    `}
                    title={`Mode ${t}`}
                >
                    {theme === t && (
                        <motion.div
                            layoutId="theme-active"
                            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                        {t === 'light' && <Sun size={14} />}
                        {t === 'dark' && <Moon size={14} />}
                        {t === 'system' && <Laptop size={14} />}
                    </span>
                </button>
            ))}
        </div>
    );
};
