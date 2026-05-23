// No 'use client' needed — no hooks, no browser APIs
// This is a pure presentational component — just JSX, no logic
// Next.js will server-render this automatically (faster load)
import { GitBranch, Sparkles, Network } from 'lucide-react'

// Define the shape of each feature item using a TypeScript interface
// This is good practice — TypeScript will warn you if you pass wrong props
interface Feature {
    icon: React.ElementType  // a component that renders an icon
    label: string
    color: string            // icon color
    bg: string               // icon background
}

const FEATURES: Feature[] = [
    {
        icon:  GitBranch,
        label: 'AST-aware indexing',
        color: '#6366F1',
        bg:    'rgba(99,102,241,.15)',
    },
    {
        icon:  Sparkles,
        label: 'Agentic AI search',
        color: '#06B6D4',
        bg:    'rgba(6,182,212,.15)',
    },
    {
        icon:  Network,
        label: 'Visual dependency maps',
        color: '#10B981',
        bg:    'rgba(16,185,129,.15)',
    },
]

export default function FeatureCards() {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1rem',
            width: '100%',
            maxWidth: '48rem'
        }}>
            {FEATURES.map(({ icon: Icon, label, color, bg }) => (
                <div
                    key={label}
                    className="cc-glass rounded-xl"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem'
                    }}
                >
                    <div
                        className="rounded-lg"
                        style={{
                            backgroundColor: bg,
                            flexShrink: 0,
                            width: '2.25rem',
                            height: '2.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Icon size={18} style={{ color }} />
                    </div>
                    <p style={{ color: '#F1F5F9', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {label}
                    </p>
                </div>
            ))}
        </div>
    )
}