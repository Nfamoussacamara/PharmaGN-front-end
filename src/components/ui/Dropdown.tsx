import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface DropdownOption {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    options: DropdownOption[];
    align?: 'left' | 'right';
    className?: string;
    dropdownClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    options,
    align = 'right',
    className,
    dropdownClassName
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={cn("relative inline-block", className)} ref={dropdownRef}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute z-50 mt-2 min-w-[160px] bg-white rounded-2xl shadow-xl border border-slate-100 py-2",
                            align === 'right' ? 'right-0' : 'left-0',
                            dropdownClassName
                        )}
                    >
                        <div className="flex flex-col">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    disabled={option.disabled}
                                    onClick={() => {
                                        if (option.onClick) option.onClick();
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-all hover:bg-slate-50 text-slate-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed",
                                        option.className
                                    )}
                                >
                                    {option.icon && (
                                        <span className="shrink-0 text-slate-400 group-hover:text-primary transition-colors">
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className="whitespace-nowrap">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
