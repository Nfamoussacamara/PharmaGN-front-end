import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';
import { ProductCard } from '@/components/client/ProductCard';
import { Product } from '@/types/client';
import { searchAndFilter } from '@/services/productService';

export const CataloguePage: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        loadProducts();
    }, [searchQuery, selectedCategory]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const results = await searchAndFilter(searchQuery, selectedCategory);
            setProducts(results);
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative text-white py-16 lg:py-24"
                style={{ background: 'var(--client-gradient-hero)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                                Commandez facilement et suivez vos commandes en temps réel
                            </h1>

                            <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                Parcourez notre catalogue, ajoutez au panier et recevez vos produits rapidement
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => scrollToSection('catalogue')}
                                    className="px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-700 text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                                >
                                    Explorer le catalogue →
                                </button>

                                <button
                                    onClick={() => navigate('/historique')}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-lg font-black rounded-2xl border-2 border-white/50 hover:border-white transition-all"
                                >
                                    Mes commandes
                                </button>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 text-sm text-white/80">
                                <span>✓ Livraison rapide</span>
                                <span>✓ Paiement sécurisé</span>
                                <span>✓ Support 24/7</span>
                            </div>
                        </motion.div>

                        {/* Image (desktop only) */}
                        <div className="hidden lg:block">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop"
                                alt="Client heureux"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Catalogue Section */}
            <section id="catalogue" className="py-12 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                        <div>
                            <div className="flex items-center justify-between w-full mb-1">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                    Featured Products
                                </h2>
                                <button className="text-emerald-600 font-bold text-sm hover:underline hidden lg:flex items-center gap-1">
                                    View All Products →
                                </button>
                            </div>
                            <p className="text-gray-500 font-medium">
                                Top choices this week with quick add to cart convenience
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-sm text-gray-600 outline-none transition-all shadow-sm"
                            >
                                <option value="">ALL PRODUCTS</option>
                                <option value="SUPPLEMENTS">SUPPLEMENTS</option>
                                <option value="SKINCARE">SKINCARE</option>
                                <option value="BABY CARE">BABY CARE</option>
                                <option value="FITNESS">FITNESS</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Chargement des produits...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-600 mb-4">Aucun produit trouvé</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('');
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
