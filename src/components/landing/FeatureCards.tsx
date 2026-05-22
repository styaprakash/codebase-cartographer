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
        <div className="grid grid-cols-3 gap-4 max-w-3xl w-full">
            {/* .map() replaces copy-pasting the same card 3 times */}
            {FEATURES.map(({ icon: Icon, label, color, bg }) => (
                <div
                    key={label}  // React needs a unique key when rendering lists
                    className="cc-glass rounded-xl px-4 py-3 flex items-center gap-3"
                >
                    <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: bg }}
                    >
                        {/* Icon is a variable holding a component — uppercase = component */}
                        <Icon size={16} style={{ color }} />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>
                        {label}
                    </p>
                </div>
            ))}
        </div>
    )
}