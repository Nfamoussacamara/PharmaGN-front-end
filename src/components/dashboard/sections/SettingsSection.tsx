import React from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * Section de paramètres (placeholder simple)
 */
export const SettingsSection: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <SettingsIcon size={28} className="text-emerald-600" />
                    Paramètres
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Gérez vos préférences et votre profil
                </p>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <User className="text-emerald-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-900">Profil</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Modifier vos informations personnelles
                            </p>
                            <Button size="sm" variant="outline" className="mt-4">
                                Modifier
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Lock className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-900">Sécurité</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Changer votre mot de passe
                            </p>
                            <Button size="sm" variant="outline" className="mt-4">
                                Modifier
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Bell className="text-amber-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-900">Notifications</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Gérer les préférences de notifications
                            </p>
                            <Button size="sm" variant="outline" className="mt-4">
                                Configurer
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Globe className="text-purple-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-900">Langue & Région</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Choisir la langue et le fuseau horaire
                            </p>
                            <Button size="sm" variant="outline" className="mt-4">
                                Modifier
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
