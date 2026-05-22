import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Brand
                indigo: {
                    DEFAULT: '#6366F1',
                    light:   '#EEEDFE',
                },
                cyan: {
                    DEFAULT: '#06B6D4',
                    light:   '#E1F5EE',
                },
                green: {
                    DEFAULT: '#10B981',
                    light:   '#EAF3DE',
                },
                amber: {
                    DEFAULT: '#EF9F27',
                    light:   '#FAEEDA',
                },
                red: {
                    DEFAULT: '#EF4444',
                    light:   '#FCEBEB',
                },
                // Backgrounds
                'dark-bg':       '#050510',
                'dark-surface':  '#0D0D1A',
                'dark-elevated': '#111124',
                // Borders
                'border-dark':   '#1E1E2E',
                // Text
                'text-primary':   '#F1F5F9',
                'text-secondary': '#94A3B8',
                'text-muted':     '#64748B',
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            boxShadow: {
                'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-cyan':   '0 0 20px rgba(6, 182, 212, 0.3)',
                'glow-red':    '0 0 20px rgba(239, 68, 68, 0.3)',
            },
            borderRadius: {
                xl:  '12px',
                '2xl': '16px',
            },
            animation: {
                'shake':        'cc-shake 0.1s infinite',
                'rotate-earth': 'cc-rotate-earth 30s linear infinite',
                'drift-clouds': 'cc-drift-clouds 40s linear infinite',
                'lens-flare':   'cc-lens-flare 3s ease-in-out infinite',
                'pulse-dot':    'cc-pulse-dot 1.5s ease-in-out infinite',
                'shimmer':      'cc-shimmer 1.5s linear infinite',
            },
        },
    },
    plugins: [],
}

export default config