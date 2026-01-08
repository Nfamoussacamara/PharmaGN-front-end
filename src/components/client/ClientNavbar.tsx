import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientNavbar: React.FC = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    const navLinks = [
        { name: 'Pharmacies', path: '/pharmacies' },
        { name: 'Catalogue', path: '/catalogue' },
        { name: 'Mes commandes', path: '/historique' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="ml-3 text-2xl font-black text-slate-900 tracking-tighter">
                            PharmaGN
                        </span>
                    </Link>

                    {/* PC Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-black transition-all hover:text-emerald-600 px-2 py-1 relative group ${isActive(link.path) ? 'text-emerald-600' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transform transition-transform duration-300 origin-left ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`} />
                            </Link>
                        ))}

                        <button
                            onClick={toggleCart}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-lg shadow-emerald-600/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Panier</span>
                            {itemCount > 0 && (
                                <span className="ml-1 bg-slate-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-lg border-2 border-white">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleCart}
                            className="p-2 text-slate-600 relative"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-50 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-4 rounded-xl text-base font-black transition-colors ${isActive(link.path)
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 px-4">
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        toggleCart();
                                    }}
                                    className="w-full bg-emerald-600 text-white px-6 py-4 rounded-xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Panier ({itemCount})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
