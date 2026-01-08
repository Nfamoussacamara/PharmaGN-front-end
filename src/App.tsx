import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import SearchPage from '@/pages/SearchPage';
import OnDutyPage from '@/pages/OnDutyPage';
import MedicationSearchPage from '@/pages/MedicationSearchPage';
import OrdersPage from '@/pages/OrdersPage';
import PharmacistDashboard from '@/pages/PharmacistDashboard';
import PharmacyDetail from '@/pages/PharmacyDetail';
import LoginPage from '@/pages/LoginPage';

// Client Interface Pages
import { CataloguePage } from '@/pages/client/CataloguePage';
import { CartPage } from '@/pages/client/CartPage';
import { CheckoutPage } from '@/pages/client/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/client/OrderConfirmationPage';
import { OrderHistoryPage } from '@/pages/client/OrderHistoryPage';
import { OrderDetailPage } from '@/pages/client/OrderDetailPage';

// Client Components
import { ClientNavbar } from '@/components/client/ClientNavbar';
import { CartDrawer } from '@/components/client/CartDrawer';

import { ToastContainer } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Activity } from 'lucide-react';

/**
 * Point d'entrée de l'application React.
 */
const AppContent: React.FC = () => {
    const { checkAuth } = useAuthStore();
    const location = useLocation();

    // Vérifier l'authentification au chargement
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const isLoginPage = location.pathname === '/login';
    const isDashboard = location.pathname === '/dashboard';

    // Client routes (new interface)
    const isClientRoute = location.pathname.startsWith('/catalogue') ||
        location.pathname.startsWith('/panier') ||
        location.pathname.startsWith('/commander') ||
        location.pathname.startsWith('/confirmation') ||
        location.pathname.startsWith('/historique') ||
        location.pathname.startsWith('/commande/');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
            {/* Navigation - Show ClientNavbar for client routes, regular Navbar for pharmacist routes */}
            {!isLoginPage && !isDashboard && (
                isClientRoute ? <ClientNavbar /> : <Navbar />
            )}

            {/* Contenu principal */}
            <main className="flex-1">
                <Routes>
                    {/* Pharmacist Routes (existing) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/pharmacy/:id" element={<PharmacyDetail />} />
                    <Route path="/garde" element={<OnDutyPage />} />
                    <Route path="/pharmacies" element={<SearchPage />} />
                    <Route path="/recherche" element={<MedicationSearchPage />} />
                    <Route path="/commandes" element={<OrdersPage />} />
                    <Route path="/dashboard" element={<PharmacistDashboard />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Client Routes (new) */}
                    <Route path="/catalogue" element={<CataloguePage />} />
                    <Route path="/panier" element={<CartPage />} />
                    <Route path="/commander" element={<CheckoutPage />} />
                    <Route path="/confirmation/:orderId" element={<OrderConfirmationPage />} />
                    <Route path="/historique" element={<OrderHistoryPage />} />
                    <Route path="/commande/:orderId" element={<OrderDetailPage />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            {/* Footer élégant (masqué sur login et dashboard) */}
            {!isLoginPage && !isDashboard && (
                <footer className="bg-white border-t border-slate-100 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 p-2 rounded-xl">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">PharmaGN</span>
                            </div>
                            <p className="text-sm text-slate-500">
                                © 2026 PharmaGN. Développé pour améliorer l'accès aux soins en Guinée.
                            </p>
                            <div className="flex gap-6">
                                <span className="text-sm font-bold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">Aide</span>
                                <span className="text-sm font-bold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">Confidentialité</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* Cart Drawer - Only on client routes */}
            {isClientRoute && <CartDrawer />}

            {/* Système de notifications global */}
            <ToastContainer />
        </div>
    );
};

import { ThemeProvider } from '@/components/ThemeProvider';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </BrowserRouter>
    );
};


/**
 * Page 404 personnalisée.
 */
const NotFound: React.FC = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-9xl font-black text-slate-100 absolute -z-10 select-none">404</h1>
        <h2 className="text-4xl font-black text-slate-800 mb-4">Oups !</h2>
        <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
            La page que vous recherchez semble introuvable ou a été déplacée.
        </p>
        <Link to="/">
            <Button size="lg">Retourner à l'accueil</Button>
        </Link>
    </div>
);

export default App;
