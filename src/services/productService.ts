import { Product } from '@/types/client';

/**
 * Service de gestion des produits pharmaceutiques
 * Utilise des données mock pour le développement
 */

// Mock data - Produits pharmaceutiques
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-001',
        name: 'Vitamin C 1000 mg',
        image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=400&fit=crop',
        price: 59900,
        category: 'SUPPLEMENTS',
        pharmacy: 'Pharmacie Centrale',
        pharmacyId: 'pharm-002',
        stock: 120,
        discount: 25,
        description: 'High potency Vitamin C for immune support'
    },
    {
        id: 'prod-002',
        name: 'Sunscreen SPF 50 PA++++',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
        price: 55900,
        category: 'SKINCARE',
        pharmacy: 'Pharmacie Moderne',
        pharmacyId: 'pharm-003',
        stock: 45,
        discount: 20,
        description: 'Maximum protection against UV rays'
    },
    {
        id: 'prod-003',
        name: 'Baby Gentle Lotion (Shea)',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop',
        price: 29700,
        category: 'BABY CARE',
        pharmacy: 'Pharmacie du Peuple',
        pharmacyId: 'pharm-001',
        stock: 60,
        discount: 25,
        description: 'Ultra gentle moisturizing for delicate baby skin'
    },
    {
        id: 'prod-004',
        name: 'Whey Protein Isolate 1 kg',
        image: 'https://images.unsplash.com/photo-1593095191071-82763e9d74a3?w=400&h=400&fit=crop',
        price: 59900,
        category: 'FITNESS',
        pharmacy: 'Pharmacie Centrale',
        pharmacyId: 'pharm-002',
        stock: 30,
        discount: 25,
        description: 'Pure protein for muscle recovery'
    },
    {
        id: 'prod-005',
        name: 'Omega-3 Fish Oil 1000 mg',
        image: 'https://images.unsplash.com/photo-1550572017-4814c992e1d5?w=400&h=400&fit=crop',
        price: 59900,
        category: 'SUPPLEMENTS',
        pharmacy: 'Pharmacie Moderne',
        pharmacyId: 'pharm-003',
        stock: 85,
        discount: 25,
        description: 'Essential fatty acids for heart and brain health'
    },
    {
        id: 'prod-006',
        name: 'Collagen Peptides Type I',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
        price: 59900,
        category: 'SUPPLEMENTS',
        pharmacy: 'Pharmacie du Peuple',
        pharmacyId: 'pharm-001',
        stock: 40,
        discount: 25,
        description: 'Supports skin elasticity and joint health'
    },
    {
        id: 'prod-007',
        name: 'Diaper Rash Cream',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
        price: 59900,
        category: 'SKINCARE',
        pharmacy: 'Pharmacie Centrale',
        pharmacyId: 'pharm-002',
        stock: 110,
        discount: 25,
        description: 'Fast relief for diaper irritation'
    },
    {
        id: 'prod-008',
        name: 'Foaming Face Cleanser',
        image: 'https://images.unsplash.com/photo-1556227191-d8d26e582d10?w=400&h=400&fit=crop',
        price: 59900,
        category: 'SKINCARE',
        pharmacy: 'Pharmacie Moderne',
        pharmacyId: 'pharm-003',
        stock: 75,
        discount: 25,
        description: 'Gentle daily cleanser for clear skin'
    }
];

/**
 * Récupère tous les produits
 */
export const getProducts = async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS;
};

/**
 * Récupère un produit par ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
};

/**
 * Recherche des produits par nom
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Filtre les produits par catégorie
 */
export const filterByCategory = async (category: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!category) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === category);
};

/**
 * Recherche et filtre combinés
 */
export const searchAndFilter = async (
    query: string,
    category: string
): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    let results = MOCK_PRODUCTS;

    if (category) {
        results = results.filter(p => p.category === category);
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery)
        );
    }

    return results;
};
