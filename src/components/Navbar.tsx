import { Link, useNavigate } from 'react-router-dom';
import { Pill, Search, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Clock, Activity, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import React from 'react';

/**
 * Barre de navigation principale avec intégration Auth.
 */
const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Pharmacies', href: '/pharmacies', icon: <Search size={18} /> },
        { name: 'Garde', href: '/garde', icon: <Clock size={18} /> },
        { name: 'Médicaments', href: '/recherche', icon: <Pill size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-emerald-50 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200">
                            <Activity className="text-white" size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tight text-slate-900">PharmaGN</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Santé & Technologie</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-emerald-600"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-100 mx-2" />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {user?.role === 'PHARMACIEN' ? (
                                    <Link to="/dashboard">
                                        <Button variant="outline" size="sm" leftIcon={<LayoutDashboard size={18} />}>
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/commandes">
                                        <Button variant="outline" size="sm" leftIcon={<ShoppingBag size={18} />}>
                                            Mes Commandes
                                        </Button>
                                    </Link>
                                )}
                                <div className="group relative">
                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-emerald-100 hover:text-emerald-600">
                                        <UserIcon size={20} />
                                    </div>
                                    {/* Dropdown simple */}
                                    <div className="absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 opacity-0 invisible group-hover:visible group-hover:scale-100 group-hover:opacity-100 transition-all">
                                        <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Utilisateur</p>
                                                <p className="text-sm font-bold text-slate-800 truncate">{user?.username}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button size="sm">Connexion</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-slate-50 bg-white p-4 lg:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-slate-50" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={user?.role === 'PHARMACIEN' ? '/dashboard' : '/commandes'}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-emerald-50"
                                >
                                    <LayoutDashboard size={18} />
                                    {user?.role === 'PHARMACIEN' ? 'Dashboard' : 'Mes Commandes'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
                                >
                                    <LogOut size={18} />
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full">Connexion</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
