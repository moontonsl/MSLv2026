import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {

    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './resources/js/**/*.jsx',
    ],

    theme: {
        container: {
            center: true,
            padding: '1rem',
            screens: {
                xl: '1200px',
                '2xl': '1400px',
            },
        },

        extend: {

            /* =========================
               COLORS
            ========================= */

            colors: {

                brand: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F2C21A',
                    600: '#D4A810',
                    700: '#A78109',
                    800: '#856507',
                    900: '#713F12',
                },

                gray: {
                    50: '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A',
                    900: '#18181B',
                },

                bg: {
                    DEFAULT: '#050505',
                    surface: '#0B0B0B',
                    card: '#121212',
                    cardHover: '#1A1A1A',
                },

                dept: {
                    blue: {
                        50:'#EFF6FF',
                        100:'#DBEAFE',
                        200:'#BFDBFE',
                        300:'#93C5FD',
                        400:'#60A5FA',
                        500:'#3B82F6',
                        600:'#2563EB',
                        700:'#1D4ED8',
                        800:'#1E40AF',
                        900:'#1E3A8A'
                    },

                    purple: { 500: '#A855F7', 600: '#9333EA' },
                    green: { 500: '#22C55E', 600: '#16A34A' },
                    red: { 500: '#EF4444', 600: '#DC2626' },
                },

                success: { 500: '#22C55E', 700: '#15803D' },
                warning: { 400: '#FBBF24', 600: '#D97706' },
                error: { 500: '#EF4444', 700: '#B91C1C' },
            },


            /* =========================
               TYPOGRAPHY
            ========================= */

            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-league-spartan)', 'sans-serif'],
            },

            fontSize: {

                /* BODY */

                'body-footer': ['10px', { lineHeight: '16px' }],
                'body-xs': ['12px', { lineHeight: '18px' }],
                'body-sm': ['14px', { lineHeight: '22px' }],
                'body-md': ['16px', { lineHeight: '26px' }],
                'body-lg': ['18px', { lineHeight: '28px' }],
                'body-xl': ['20px', { lineHeight: '32px' }],

                /* HEADINGS */

                'hero-lg': ['60px', { lineHeight: '72px' }],
                'hero-md': ['48px', { lineHeight: '58px' }],
                'display-lg': ['72px', { lineHeight: '80px' }],
                'section': ['36px', { lineHeight: '44px' }],
                'subsection': ['30px', { lineHeight: '38px' }],
                'card-title': ['24px', { lineHeight: '32px' }],
                'heading-sm': ['20px', { lineHeight: '28px' }],
                'label': ['18px', { lineHeight: '26px' }],
            },


            /* =========================
               SPACING
            ========================= */

            spacing: {
                '3xs': '2px',
                '2xs': '4px',
                'xs': '8px',
                'sm': '12px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px',
            },


            /* =========================
               RADIUS + SHADOW
            ========================= */

            borderRadius: {
                sm: '6px',
                md: '8px',
                xl: '12px',
            },

            boxShadow: {
                soft: '0 10px 25px rgba(0,0,0,0.25)',
                glow: '0 0 20px rgba(242,194,26,0.35)',
            },

        },
    },

    plugins: [
        forms,
    ],
};