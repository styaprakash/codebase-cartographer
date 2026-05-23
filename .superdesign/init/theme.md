# Theme / Design System

## Tailwind Config (`tailwind.config.ts`)

```ts
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
                'dark-bg':       '#050510',
                'dark-surface':  '#0D0D1A',
                'dark-elevated': '#111124',
                'border-dark':   '#1E1E2E',
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
```

## CSS Variables (`src/app/globals.css`)

```css
:root {
    --indigo:        #6366F1;
    --indigo-light:  #EEEDFE;
    --cyan:          #06B6D4;
    --cyan-light:    #E1F5EE;
    --green:         #10B981;
    --bg-base:       #050510;
    --bg-surface:    #0D0D1A;
    --bg-elevated:   #111124;
    --border:        #1E1E2E;
    --border-active: #6366F1;
    --text-primary:   #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted:     #64748B;
    --amber:  #EF9F27;
    --red:    #EF4444;
    --teal:   #0F6E56;
    --background: var(--bg-base);
    --foreground: var(--text-primary);
}
```

## Fonts
- **Sans**: Geist Sans (via `next/font/google`, CSS var `--font-geist-sans`)
- **Mono**: Geist Mono (via `next/font/google`, CSS var `--font-geist-mono`)

## Key Design Values
- **Background**: `#050510` (deep space dark)
- **Surface**: `#0D0D1A` (cards/panels)
- **Elevated**: `#111124` (modals)
- **Primary brand**: `#6366F1` (indigo)
- **Accent**: `#06B6D4` (cyan)
- **Text primary**: `#F1F5F9`
- **Text secondary**: `#94A3B8`
- **Text muted**: `#64748B`
- **Border**: `#1E1E2E`
- **Border radius**: 12px (xl), 16px (2xl)
- **Glow shadows**: `glow-indigo`, `glow-cyan`, `glow-red`

## Utility CSS Classes
| Class | Purpose |
|-------|---------|
| `.cc-glass` | Dark frosted glass card with hover glow |
| `.cc-progress-fill` | Indigo→cyan gradient progress bar |
| `.cc-dot-pulse` | Pulsing status dot |
| `.cc-skeleton` | Shimmer loading skeleton |
| `.cc-cursor` | Custom cyan cursor (landing page) |
| `.cc-cta` | Button lift on hover |

## Keyframe Animations
| Name | Purpose | Duration |
|------|---------|----------|
| `cc-shake` | Star shake on cursor proximity | 0.1s |
| `cc-rotate-earth` | Earth globe rotation | 30s linear infinite |
| `cc-drift-clouds` | Cloud layer drift | 40s linear infinite |
| `cc-lens-flare` | Atmosphere glow pulse | 3s ease-in-out infinite |
| `cc-pulse-dot` | Status indicator pulse | 1.5s ease-in-out infinite |
| `cc-shimmer` | Skeleton loading shimmer | 1.5s linear infinite |
