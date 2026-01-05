/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // Palette de couleurs médicale/pharmaceutique
            // Palette de couleurs médicale/pharmaceutique
            colors: {
                // Sémantique - Texte
                text: {
                    heading: {
                        primary: 'var(--text-heading-primary)',
                        secondary: 'var(--text-heading-secondary)',
                        tertiary: 'var(--text-heading-tertiary)',
                    },
                    body: {
                        primary: 'var(--text-body-primary)',
                        secondary: 'var(--text-body-secondary)',
                    },
                    muted: 'var(--text-muted)',
                    disabled: 'var(--text-disabled)',
                    link: {
                        DEFAULT: 'var(--text-link)',
                        hover: 'var(--text-link-hover)',
                    },
                    status: {
                        success: 'var(--text-success)',
                        warning: 'var(--text-warning)',
                        error: 'var(--text-error)',
                        info: 'var(--text-info)',
                    },
                    on: {
                        primary: 'var(--text-on-primary)',
                        dark: 'var(--text-on-dark)',
                    }
                },

                // Sémantique - Backgrounds
                bg: {
                    app: 'var(--bg-app)',
                    card: 'var(--bg-card)',
                    elevated: 'var(--bg-elevated)',
                    secondary: 'var(--bg-secondary)',
                    accent: 'var(--bg-accent)', // Pharmacie de garde

                    status: {
                        success: 'var(--bg-success)',
                        warning: 'var(--bg-warning)',
                        error: 'var(--bg-error)',
                        info: 'var(--bg-info)',
                    },

                    interactive: {
                        hover: 'var(--bg-hover)',
                        active: 'var(--bg-active)',
                        disabled: 'var(--bg-disabled)',
                    }
                },

                // Mapping des couleurs existantes pour compatibilité + Override
                // Vert médical principal (override de la palette statique)
                primary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: 'var(--bg-primary)',  // MAIN PRIMARY COLOR - #047857
                    600: 'var(--bg-primary-hover)',  // #065F46
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                    950: '#022c22',
                    // Semantic aliases
                    DEFAULT: 'var(--bg-primary)',
                    hover: 'var(--bg-primary-hover)',
                    light: 'var(--bg-primary-light)',
                },

                // Bleu secondaire (confiance, santé)
                secondary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: 'var(--bg-info)',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },

                // Accent (urgence, garde)
                accent: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#450a0a',
                },

                // Bordures sémantiques
                border: {
                    light: 'var(--border-light)',
                    DEFAULT: 'var(--border-default)',
                    strong: 'var(--border-strong)',
                }
            },

            // Animations personnalisées
            animation: {
                'fadeIn': 'fadeIn 0.5s ease-in-out',
                'slideUp': 'slideUp 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },

            // Keyframes pour les animations
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },

            // Ombres personnalisées
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'card': 'var(--shadow-md)', // Mapped to md
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
                'card-hover': 'var(--shadow-lg)',
            },

            // Typographie
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'headings': ['Poppins', 'sans-serif'],
                'mono': ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}
