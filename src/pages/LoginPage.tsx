import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import loginImage from '../assets/pharmacist-login-bg.jpg';

/**
 * Page de connexion PharmaGN - Split Layout.
 * Gauche: Image en plein écran.
 * Droite: Formulaire compact et centré.
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        <div className="flex w-full h-screen overflow-hidden bg-slate-50 font-sans">
            {/* Partie Gauche : Image (cachée sur mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src={loginImage}
                    alt="Pharmacist working"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay optionnel pour assombrir légèrement l'image si nécessaire */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Partie Droite : Formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative pb-30">

                <div className="w-full max-w-[450px] flex flex-col gap-4 pb-35">
                    {/* Boîte Principale (Transparente) */}
                    <div className="p-10 flex flex-col items-center rounded-none">
                        {/* Logo Texte PharmaGN */}
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic select-none">
                                PharmaGN
                            </h1>
                            <div className="h-1 w-10 bg-emerald-600 mx-auto mt-1" />
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            {error && (
                                <div className="p-2 border border-rose-100 bg-rose-50 text-rose-600 text-xs font-bold text-center leading-tight mb-2">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 outline-none transition-all placeholder:text-slate-500 font-bold text-sm text-slate-950 rounded-none"
                                    placeholder="Nom d'utilisateur"
                                />

                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 outline-none transition-all placeholder:text-slate-500 font-bold text-sm text-slate-950 rounded-none"
                                    placeholder="Mot de passe"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !username || !password}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-sm uppercase tracking-widest transition-colors border-none rounded-none mt-4 flex items-center justify-center shadow-none active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Se connecter"
                                )}
                            </button>

                            {/* Séparateur */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 px-2 text-slate-400 font-bold tracking-widest">
                                        OU
                                    </span>
                                </div>
                            </div>

                            {/* Bouton Google */}
                            <button
                                type="button"
                                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 transition-colors rounded-none flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Se connecter avec Google
                            </button>

                            <div className="flex items-center justify-between mt-8 text-sm font-bold uppercase tracking-tight">
                                <button type="button" className="text-slate-500 hover:text-emerald-600 transition-colors font-bold uppercase">
                                    Mot de passe oublié ?
                                </button>

                                <div className="text-slate-500">
                                    Nouveau ici ?{' '}
                                    <Link to="/register" className="text-emerald-600 hover:underline transition-colors ml-1">
                                        S'inscrire
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Boîte secondaire (Inscription) */}
                </div>

                {/* Footer de pied de page universel (positionné en bas de la colonne de droite) */}

            </div>
        </div>
    );
};

export default LoginPage;
