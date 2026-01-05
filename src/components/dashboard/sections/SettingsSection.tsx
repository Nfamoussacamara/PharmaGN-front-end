import React from 'react';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * Section de paramètres (placeholder simple)
 */
export const SettingsSection: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Action Bar */}
            <div className="flex items-center justify-between shrink-0 bg-bg-card/30 p-2 rounded-2xl border border-border-light/50 backdrop-blur-sm">
                <div className="px-4">
                    <p className="text-text-body-secondary text-sm font-bold flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        Gérez vos préférences et votre profil
                    </p>
                </div>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary-light rounded-xl">
                            <User className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-text-heading-tertiary">Profil</h3>
                            <p className="text-sm text-text-body-secondary mt-1">
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
                        <div className="p-3 bg-secondary-100 rounded-xl">
                            <Lock className="text-secondary-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-text-heading-tertiary">Sécurité</h3>
                            <p className="text-sm text-text-body-secondary mt-1">
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
                        <div className="p-3 bg-bg-status-warning rounded-xl">
                            <Bell className="text-amber-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-text-heading-tertiary">Notifications</h3>
                            <p className="text-sm text-text-body-secondary mt-1">
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
                            <h3 className="text-lg font-black text-text-heading-tertiary">Langue & Région</h3>
                            <p className="text-sm text-text-body-secondary mt-1">
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
