import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

/**
 * Composant Modal animé avec Framer Motion.
 * Utilise le système de design PharmaGN avec tokens sémantiques.
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    className
}) => {
    // Empêcher le scroll du body quand la modal est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-text-heading-tertiary/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            'relative w-full overflow-hidden rounded-3xl bg-bg-card shadow-xl',
                            sizes[size],
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border-light px-8 py-6">
                            {title && <h3 className="text-xl font-bold text-text-heading-tertiary">{title}</h3>}
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-text-muted hover:bg-bg-hover hover:text-text-body-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[80vh] overflow-y-auto px-8 py-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
