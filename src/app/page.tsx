// 'use client' NOT needed here — page.tsx can stay as a Server Component
// Only the child components that use hooks need 'use client'
import StarField     from '@/components/landing/StarField'
import Earth        from '@/components/landing/Earth'
import FeatureCards from '@/components/landing/FeatureCards'
import GitHubButton from '@/components/landing/GitHubButton'
export default function LandingPage() {
    return (
        // Dark space background fills the whole viewport
        <main
            className="min-h-screen overflow-hidden relative"
            style={{ backgroundColor: '#050510' }}
        >

            {/* ── Layer 1: Stars (furthest back, z-index 2) ── */}
            {/* Rendered first in DOM but z-index controls visual order */}
            <StarField />

            {/* ── Layer 2: Earth (middle, z-index 5) ── */}
            <Earth />

            {/* ── Layer 3: Text content (front, z-index 10) ── */}
            {/* This layer has NO parallax — stays fixed while earth + stars move */}
            <div
                className="relative flex flex-col items-center justify-center min-h-screen px-8 py-10"
                style={{ zIndex: 10 }}
            >
                {/* Pushes text below the earth globe */}
                <div style={{ height: 240 }} />

                {/* Headline */}
                <h1 className="text-6xl font-bold tracking-tight text-center" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: '#F1F5F9' }}>Codebase</span>
                    <span style={{ color: '#06B6D4' }}> Cartographer</span>
                </h1>

                <p className="text-2xl font-semibold text-center" style={{ color: '#F1F5F9', marginBottom: '0.75rem' }}>
                    Understand any codebase in minutes.
                </p>

                <p className="text-base text-center max-w-2xl" style={{ color: '#64748B', marginBottom: '2rem' }}>
                    Connect your GitHub repo → AI indexes your code → Ask anything in plain English
                </p>

                {/* GitHub CTA — onClick is empty for now, we wire NextAuth in Week 1 */}
                <GitHubButton />

                <p className="text-[10px]" style={{ color: '#64748B', marginBottom: '2.5rem' }}>
                    No credit card. Free to try. Reads your repos, never writes.
                </p>

                <FeatureCards />
            </div>
        </main>
    )
}

// Inline SVG — no extra import needed for a single icon like this
function GitHubIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207
        11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416
        -4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083
        -.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834
        2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305
        -5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124
        -.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266
        1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552
        3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235
        1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823
        1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589
        8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
    )
}