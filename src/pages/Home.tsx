import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    TrendingUp,
    ChevronDown,
    Building2,
    ArrowDown,
    MapPin,
    AlertCircle,
    Check,
    FileText,
    CreditCard,
    Users,
    Bell,
    Star,
    X,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ChevronLeft,
    ChevronRight,
    ShoppingCart
} from 'lucide-react';
import type { Pharmacy, SearchParams } from '@/types';
import { obtenirPharmacies } from '@/services/api';
import SearchBar from '@/components/SearchBar';
import PharmacyCard from '@/components/PharmacyCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// Hook pour l'animation de comptage
const useCountUp = (end: number, duration: number = 2) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(countRef, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const startValue = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(easeOutQuart * (end - startValue) + startValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return { count, ref: countRef };
};

// Composant pour afficher un compteur animé
const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 2 }) => {
    // Extraire la partie numérique (avec décimales) et le suffixe
    const numericMatch = value.match(/[\d.]+/);
    const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
    const suffix = value.replace(/[\d.]+/, '');

    // Déterminer le nombre de décimales
    const decimalPlaces = (numericMatch && numericMatch[0].includes('.'))
        ? numericMatch[0].split('.')[1].length
        : 0;

    const { count, ref } = useCountUp(numericValue, duration);

    // Formater le nombre avec les bonnes décimales
    const formattedCount = decimalPlaces > 0
        ? count.toFixed(decimalPlaces)
        : count.toString();

    return (
        <span ref={ref}>
            {formattedCount}{suffix}
        </span>
    );
};

const HERO_SLIDES = [
    {
        image: "/images/hero/vision.png",
        title: "Gerez votre pharmacie <br />intelligemment",
        description: "Une solution digitale pensee pour les pharmacies modernes en Guinee.",
        accent: "text-emerald-400"
    },
    {
        image: "/images/hero/dashboard.png",
        title: "Tout votre business, <br />en temps reel",
        description: "Stocks, ventes, commandes et statistiques en un seul tableau de bord.",
        accent: "text-blue-400"
    },
    {
        image: "/images/hero/control.png",
        title: "Moins d'erreurs, <br />plus de controle",
        description: "Automatisez votre gestion et concentrez-vous sur vos patients.",
        accent: "text-indigo-400"
    },
    {
        image: "/images/hero/cta.png",
        title: "Passez a la gestion <br />digitale aujourd'hui",
        description: "PharmaGN, la solution qui fait avancer votre pharmacie.",
        accent: "text-emerald-400"
    },
    {
        image: "/images/hero/customer.png",
        title: "Trouvez la pharmacie <br />la plus proche",
        description: "Localisez les pharmacies disponibles et verifiez leurs stocks en temps reel.",
        accent: "text-blue-500"
    }
];

// Variantes d'animation pour les slides (Fade + Slide subtil)
const slideVariants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 40 : -40,
        zIndex: 0
    }),
    center: {
        zIndex: 1,
        opacity: 1,
        x: 0,
        transition: {
            opacity: { duration: 0.8 },
            x: { duration: 0.8, ease: "easeOut" }
        }
    },
    exit: (direction: number) => ({
        zIndex: 0,
        opacity: 0,
        x: direction < 0 ? 40 : -40,
        transition: {
            opacity: { duration: 0.6 },
            x: { duration: 0.6, ease: "easeIn" }
        }
    })
} as any;

// Composant interne pour une slide stable
const HeroSlide: React.FC<{
    slide: typeof HERO_SLIDES[0],
    direction: number,
    page: number
}> = ({ slide, direction, page }) => {
    return (
        <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
        >
            <div className="absolute inset-0 bg-slate-950" />
            <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mt-[-5%]">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white text-xs font-black uppercase tracking-widest">Plateforme N°1 en Guinée</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
                        {slide.title.split('<br />').map((text, i) => (
                            <React.Fragment key={i}>
                                {text}
                                {i === 0 && <br />}
                            </React.Fragment>
                        ))}
                    </h1>

                    <p className="text-xl lg:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        {slide.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/catalogue" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                            <ShoppingCart size={22} />
                            Acheter des médicaments
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full font-black text-lg transition-all flex items-center justify-center gap-3 group">
                            <Building2 size={20} className="group-hover:scale-110 transition-transform" />
                            Gérer ma pharmacie
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Home: React.FC = () => {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const [[page, direction], setPage] = useState([0, 0]);

    const currentSlide = ((page % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    // Carrousel logic
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [page]);

    const chargerPharmacies = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await obtenirPharmacies(searchParams);
            setPharmacies(response.results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            setPharmacies([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        chargerPharmacies();
    }, [chargerPharmacies]);

    const handleSearch = useCallback((query: string): void => {
        setSearchParams((prev) => ({ ...prev, search: query || undefined, page: 1 }));
    }, []);

    const handleCityFilter = useCallback((city: string): void => {
        setSearchParams((prev) => ({ ...prev, city: city || undefined, page: 1 }));
    }, []);

    const handleStatusFilter = useCallback((status: string): void => {
        setSearchParams((prev) => ({ ...prev, is_open: status ? status === 'true' : undefined, page: 1 }));
    }, []);

    const stats = [
        { icon: Package, value: '500+', label: 'Commandes gérées' },
        { icon: Building2, value: '50+', label: 'Pharmacies partenaires' },
        { icon: TrendingUp, value: '99.9%', label: 'Disponibilité' },
        { icon: ArrowDown, value: '40%', label: 'Pertes évitées' }
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* 1. HERO SECTION */}
            <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                {/* Carousel Background */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <HeroSlide
                            key={page}
                            slide={HERO_SLIDES[currentSlide]}
                            direction={direction}
                            page={page}
                        />
                    </AnimatePresence>
                </div>

                {/* Carousel Arrows */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-8 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                        className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); paginate(1); }}
                        className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto group"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Trust Indicators (Static) */}
                <div className="absolute bottom-24 left-0 right-0 z-20 pointer-events-none">
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-white/70">
                        <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Aucune carte bancaire</span>
                        <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Installation 5 min</span>
                        <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Support 24/7</span>
                    </div>
                </div>

                {/* Slides Indicators */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {HERO_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const newDirection = i > currentSlide ? 1 : -1;
                                setPage([i, newDirection]);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30'}`}
                        />
                    ))}
                </div>

                {/* Scroll bounce */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 cursor-pointer z-20"
                    onClick={() => {
                        const portalSection = document.getElementById('portails');
                        portalSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* 1.5 DUAL PORTAL SECTION */}
            <section id="portails" className="py-24 bg-white relative z-30 -mt-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Portale Client */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="group p-10 bg-gradient-to-br from-emerald-50 to-white rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-8 transform group-hover:rotate-6 transition-transform">
                                <ShoppingCart size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Espace Client</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm">
                                Vous cherchez un médicament ? Localisez les pharmacies autour de vous, vérifiez les stocks et commandez en ligne.
                            </p>
                            <Link to="/catalogue" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
                                Accéder au catalogue →
                            </Link>
                        </motion.div>

                        {/* Portale Pharmacien */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="group p-10 bg-gradient-to-br from-blue-50 to-white rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-8 transform group-hover:-rotate-6 transition-transform">
                                <Building2 size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Espace Pharmacien</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm">
                                Vous êtes propriétaire d'une officine ? Gérez vos stocks, vos ventes et vos commandes sur une interface unique.
                            </p>
                            <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
                                Gérer ma pharmacie →
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. STATS SECTION */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                                    <AnimatedCounter value={stat.value} duration={2.5} />
                                </div>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. PHARMACIES SEARCH & RESULTS SECTION */}
            <section id="recherche" className="py-24 bg-white min-h-[600px]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Annuaire
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Trouvez votre <span className="text-emerald-600">pharmacie</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium">
                            Recherchez parmi les établissements disponibles dans toutes les régions de la Guinée.
                        </p>
                    </div>

                    <div className="mb-12 relative z-30">
                        <div className="p-2 bg-white/60 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-2xl">
                            <SearchBar
                                onSearch={handleSearch}
                                onCityFilter={handleCityFilter}
                                onStatusFilter={handleStatusFilter}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <LoadingSpinner message="Chargement des pharmacies..." />
                    ) : error ? (
                        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex items-start gap-4">
                            <AlertCircle className="h-8 w-8 text-rose-500 shrink-0" />
                            <div>
                                <h3 className="text-xl font-black text-rose-900 mb-2">Erreur de chargement</h3>
                                <p className="text-rose-700 font-medium mb-4">{error}</p>
                                <button
                                    onClick={chargerPharmacies}
                                    className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-black"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    ) : pharmacies.length === 0 ? (
                        <div className="bg-slate-50 rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                            <div className="max-w-md mx-auto">
                                <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <MapPin size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Aucune pharmacie trouvée</h3>
                                <p className="text-slate-500 font-bold">Essayez de modifier vos critères de recherche.</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                    {pharmacies.length} établissement{pharmacies.length > 1 ? 's' : ''} trouvé{pharmacies.length > 1 ? 's' : ''}
                                </p>
                            </div>

                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                <AnimatePresence>
                                    {pharmacies.map((pharmacy) => (
                                        <motion.div
                                            key={pharmacy.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <PharmacyCard pharmacy={pharmacy} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. FEATURES SECTION */}
            <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Fonctionnalités
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="text-xl text-slate-500 font-medium">
                            Une suite complète d'outils pensés pour simplifier votre quotidien
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Package, title: 'Gestion intelligente des stocks', description: 'Suivez vos inventaires en temps réel et recevez des alertes automatiques avant les ruptures' },
                            { icon: FileText, title: 'Suivi des commandes', description: 'Status, historique complet et notifications instantanées pour chaque commande' },
                            { icon: CreditCard, title: 'Historique des ventes', description: "Chiffre d'affaires, statistiques détaillées et exports personnalisables" },
                            { icon: Users, title: 'Gestion des clients', description: "Fichier client, historique d'achats et programme de fidélité intégré" },
                            { icon: TrendingUp, title: 'Statistiques avancées', description: 'Dashboards interactifs, KPIs métier et prévisions de ventes' },
                            { icon: Bell, title: 'Alertes intelligentes', description: 'Notifications pour ruptures, expirations produits et anomalies détectées' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <feature.icon size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Comment ça marche
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Démarrez en 3 étapes simples
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-emerald-200" />

                        {[
                            { step: 1, title: 'Créez votre pharmacie', desc: 'Renseignez les informations de base en 2 minutes', color: 'from-emerald-500 to-emerald-600' },
                            { step: 2, title: 'Ajoutez vos produits', desc: 'Importez votre catalogue ou créez-le manuellement', color: 'from-blue-500 to-blue-600' },
                            { step: 3, title: 'Gérez intelligemment', desc: 'Vendez, analysez et développez votre activité', color: 'from-emerald-600 to-emerald-700' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative text-center z-10"
                            >
                                <div className={`w-28 h-28 mx-auto bg-gradient-to-br ${item.color} rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black mb-8 shadow-2xl shadow-emerald-900/20`}>
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 font-bold max-w-[200px] mx-auto">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. COMPARISON SECTION */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Pourquoi choisir <span className="text-emerald-600">PharmaGN</span> ?
                        </h2>
                        <p className="text-xl text-slate-500 font-bold">La différence qui change tout au quotidien.</p>
                    </div>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                        {/* PharmaGN */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="p-10 bg-white rounded-[2.5rem] border-4 border-emerald-500/20 shadow-2xl shadow-emerald-900/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Recommandé</span>
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                                    <Check size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">PharmaGN</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    { text: 'Gestion en temps réel', bold: 'temps réel' },
                                    { text: 'Sécurisé et sauvegardé automatiquement', bold: 'Sécurisé' },
                                    { text: 'Statistiques et rapports détaillés', bold: 'Statistiques' },
                                    { text: 'Accessible partout (web, mobile)', bold: 'Accessible partout' },
                                    { text: 'Alertes intelligentes ruptures', bold: 'Alertes intelligentes' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-slate-600 font-medium">
                                        <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                            <Check size={14} className="text-emerald-600" />
                                        </div>
                                        <span>{item.text.split(item.bold)[0]}<strong className="text-slate-900 font-black">{item.bold}</strong>{item.text.split(item.bold)[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Classique */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="p-10 bg-slate-100/50 rounded-[2.5rem] border-2 border-slate-200 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-slate-300 rounded-2xl flex items-center justify-center text-slate-600">
                                    <X size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-400 tracking-tight">Gestion Classique</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    'Papier / Excel obsolètes',
                                    "Risque d'erreurs et pertes",
                                    'Aucune visibilité réelle',
                                    'Limité à un seul endroit',
                                    "Pas d'alertes automatiques"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-slate-400 font-bold">
                                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                            <X size={14} className="text-slate-500" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 7. SCREENSHOTS GALLERY */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-4 py-2 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            Interface
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Découvrez l'interface
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            { img: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1000", title: "Interface Dashboard", desc: "Le pilotage central de votre officine" },
                            { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", title: "Analyse des Ventes", desc: "Visualisez votre croissance en un clin d'œil" },
                            { img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000", title: "Gestion des Stocks", desc: "Contrôle total sur l'inventaire physique" },
                            { img: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&q=80&w=1000", title: "Support Professionnel", desc: "Gérez vos clients avec efficacité" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="group relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 cursor-pointer border border-slate-100"
                            >
                                <img src={item.img} alt={item.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90 p-8 flex flex-col justify-end">
                                    <h4 className="text-white text-2xl font-black mb-2 tracking-tight">{item.title}</h4>
                                    <p className="text-white/70 font-bold">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. TESTIMONIALS */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500 blur-[150px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-full bg-blue-500 blur-[150px] translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                            Ils nous font confiance
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "PharmaGN a transformé la gestion de ma pharmacie. Plus de ruptures, tout est fluide.", name: "Dr. Mamadou Diallo", role: "Pharmacien, Conakry", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200" },
                            { quote: "Interface intuitive et support réactif. Je recommande à tous mes collègues !", name: "Aïssatou Baldé", role: "Pharmacienne, Labé", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" },
                            { quote: "Les statistiques m'ont permis d'optimiser mes commandes et réduire mes coûts.", name: "Boubacar Sylla", role: "Gérant, Kankan", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors"
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 text-lg font-medium italic mb-8 leading-relaxed">
                                    "{item.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full border-2 border-emerald-500 p-0.5" />
                                    <div>
                                        <p className="text-white font-black">{item.name}</p>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{item.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FINAL CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-blue-900" />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='%23fff'/%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px'
                }} />

                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                        Prêt à moderniser votre pharmacie ?
                    </h2>
                    <p className="text-2xl text-white/80 mb-12 font-bold">
                        Rejoignez les dizaines de pharmacies qui ont déjà fait le choix de l'efficacité.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full px-12 py-6 bg-white hover:bg-slate-50 text-emerald-700 text-xl font-black rounded-2xl shadow-2xl transform hover:scale-105 transition-all">
                                Commencer maintenant →
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xl font-black rounded-2xl border-2 border-white/50 hover:border-white transition-all">
                            Nous contacter
                        </button>
                    </div>
                    <p className="mt-10 text-white/60 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-6">
                        <span>✓ Essai gratuit 14 jours</span>
                        <span className="h-1 w-1 bg-white/30 rounded-full" />
                        <span>✓ Support inclus</span>
                    </p>
                </div>
            </section>

            {/* 10. PREMIUM FOOTER */}
            <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <Package className="text-white" size={24} />
                                </div>
                                <span className="text-2xl font-black text-white tracking-tighter">PharmaGN</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                La plateforme intelligente N°1 en Guinée pour gérer votre pharmacie en toute simplicité.
                            </p>
                            <div className="flex gap-4">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            { title: 'Produit', links: ['Fonctionnalités', 'Tarifs', 'Démo', 'FAQ'] },
                            { title: 'Entreprise', links: ['À propos', 'Contact', 'Blog', 'Carrières'] },
                            { title: 'Légal', links: ['Confidentialité', 'Conditions', 'Cookies', 'Sécurité'] }
                        ].map((group, i) => (
                            <div key={i}>
                                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">{group.title}</h4>
                                <ul className="space-y-4">
                                    {group.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="hover:text-emerald-400 transition-colors font-bold text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
                        <p>© 2026 PharmaGN. Tous droits réservés.</p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full">
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                            Système opérationnel
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
