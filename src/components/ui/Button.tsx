import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Composant Button réutilisable avec états de chargement et icônes.
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-300',
        outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 disabled:border-emerald-200 disabled:text-emerald-200',
        ghost: 'text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={cn(
                'flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};
