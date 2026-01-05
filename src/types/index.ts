/**
 * Définitions TypeScript pour PharmaGN Phase 2.
 * Toutes les interfaces et types utilisés dans l'application.
 */

// ============================================
// AUTHENTIFICATION & UTILISATEUR
// ============================================

/** Rôles utilisateurs possibles */
export type UserRole = 'PATIENT' | 'PHARMACIEN' | 'REGULATEUR';

/** Interface Utilisateur */
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    role_display: string;
    pharmacy: number | null; // ID de la pharmacie si pharmacien
    license_number: string | null;
    is_verified: boolean;
    date_joined: string;
}

/** Tokens JWT */
export interface AuthTokens {
    access: string;
    refresh: string;
}

/** Réponse de connexion */
export interface AuthResponse extends AuthTokens {
    user: User;
}

// ============================================
// PHARMACIE & GARDE
// ============================================

/** Horaires d'ouverture par jour */
export interface OpeningHours {
    [day: string]: {
        open: string;
        close: string;
        is_closed?: boolean;
    };
}

/** Interface Pharmacie étendue */
export interface Pharmacy {
    id: number;
    name: string;
    license_number: string;
    address: string;
    city: string;
    phone: string;
    email: string | null;
    latitude: number | null;
    longitude: number | null;
    opening_hours: OpeningHours | null;
    is_open: boolean;
    is_active: boolean;
    is_verified: boolean;

    // Champs calculés par l'API
    status_display: string;
    has_location: boolean;
    is_open_now: boolean;
    is_on_duty_now: boolean;
    distance?: number; // Optionnel (calculé par nearby endpoint)

    created_at: string;
    updated_at: string;
}

/** Types de garde */
export type DutyType = 'WEEKEND' | 'HOLIDAY' | 'NIGHT' | 'OTHER';

/** Planning de garde */
export interface DutySchedule {
    id: number;
    pharmacy: number;
    pharmacy_details?: Partial<Pharmacy>;
    duty_type: DutyType;
    duty_type_display: string;
    start_datetime: string;
    end_datetime: string;
    is_active: boolean;
    notes: string | null;
    time_remaining?: string; // "2h 15m"
}

// ============================================
// MÉDICAMENTS & STOCK
// ============================================

/** Statuts réglementaires */
export type RegulatoryStatus = 'OTC' | 'PRESCRIPTION' | 'CONTROLLED';

/** Médicament */
export interface Medication {
    id: number;
    name: string;
    description: string;
    manufacturer: string;
    atc_code: string | null;
    regulatory_status: RegulatoryStatus;
    regulatory_status_display: string;
    requires_prescription: boolean;
    image: string | null;
    is_active: boolean;
}

/** Interface minimaliste pour les relations imbriquées (Utilisateur) */
export interface UserMinimal {
    id: number;
    username: string;
    full_name: string;
    role: string;
}

/** Stock spécifique */
export interface Stock {
    id: number;
    pharmacy: number;
    pharmacy_name?: string;
    pharmacy_detail?: Pharmacy;
    medication: number;
    medication_detail?: Medication;
    quantity: number;
    unit_price: number;
    low_stock_threshold: number;
    is_available: boolean;
    is_low_stock: boolean;
    last_restocked: string;
}

// ============================================
// COMMANDES & ORDONNANCES
// ============================================

/** Statuts Ordonnance */
export type PrescriptionStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'EXPIRED';

/** Ordonnance */
export interface Prescription {
    id: number;
    patient: number;
    patient_name?: string;
    document: string; // URL du fichier
    prescriber_name: string;
    prescriber_license: string | null;
    issue_date: string;
    expiry_date: string;
    status: PrescriptionStatus;
    status_display: string;
    is_expired: boolean;
    validation_notes: string | null;
    created_at: string;
}

/** Statuts Commande */
export type OrderStatus = 'PENDING' | 'VALIDATED' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

/** Commande / Réservation */
export interface Order {
    id: number;
    patient: number;
    patient_name?: string;
    patient_detail?: UserMinimal;
    pharmacy: number;
    pharmacy_name?: string;
    pharmacy_detail?: Pharmacy;
    medication: number;
    medication_name?: string;
    medication_detail?: Medication;
    prescription: number | null;
    prescription_detail?: Prescription;
    quantity: number;
    unit_price: number;
    total_price: number;
    status: OrderStatus;
    status_display: string;
    rejection_reason: string | null;
    reserved_until: string;
    time_remaining?: string;
    time_remaining_minutes?: number;
    created_at: string;
    updated_at: string;
}

// ============================================
// NOTIFICATIONS & ÉTATS UI
// ============================================

/** Types notifications */
export type NotificationType = 'ORDER' | 'PRESCRIPTION' | 'STOCK' | 'SYSTEM';

/** Notification */
export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

/** Réponse API DRF générique */
export interface ApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/** Paramètres de recherche API */
export interface SearchParams {
    search?: string;
    city?: string;
    is_open?: boolean;
    on_duty?: boolean;
    regulatory_status?: RegulatoryStatus;
    page?: number;
    ordering?: string;
    lat?: number;
    lng?: number;
    radius?: number;
}

/** État de chargement */
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

/** Villes principales de Guinée */
export const VILLES_GUINEE = [
    'Conakry',
    'Kindia',
    'Labé',
    'Kankan',
    'Nzérékoré',
    'Boké',
    'Mamou',
    'Siguiri',
    'Kissidougou',
    'Guéckédou',
] as const;

export type VilleGuinee = typeof VILLES_GUINEE[number] | string;

/** Filtres pour la recherche de commandes */
export interface OrderFilters {
    status?: OrderStatus[];
    pharmacy_id?: number | string;
    date_from?: string;
    date_to?: string;
    period?: 'today' | 'week' | 'month' | 'last_3_months' | 'custom';
    price_min?: number;
    price_max?: number;
    has_prescription?: boolean;
    prescription_status?: PrescriptionStatus;
    search?: string;
    ordering?: string;
    page?: number;
}
