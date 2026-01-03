import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Activity, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Page de connexion de l'application PharmaGN.
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Déterminer la redirection après connexion
    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate(from, { replace: true });
        } catch (err) {
            // L'erreur est gérée par le store
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* En-tête du formulaire */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                        <Activity size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Bon retour !</h1>
                    <p className="text-slate-500 font-medium">Connectez-vous à votre compte PharmaGN</p>
                </div>

                {/* Formulaire de connexion */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Message d'erreur */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Nom d'utilisateur */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Utilisateur</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        <UserIcon size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-medium placeholder:text-slate-400"
                                        placeholder="votre_nom_utilisateur"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-medium placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lien mot de passe oublié */}
                        <div className="flex justify-end">
                            <button type="button" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Mot de passe oublié ?
                            </button>
                        </div>

                        {/* Bouton de validation */}
                        <Button
                            type="submit"
                            className="w-full py-7 text-lg rounded-2xl shadow-lg shadow-emerald-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Connexion...
                                </span>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Lien d'inscription */}
                <p className="text-center mt-8 text-slate-500 font-medium">
                    Pas encore de compte ?{' '}
                    <button className="text-emerald-600 font-bold hover:underline">
                        Créer un compte
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
