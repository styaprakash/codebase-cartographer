'use client'

import { ArrowRight, MapPin } from 'lucide-react'

export default function EmptyState() {
    return (
        <div
            id="empty-state"
            style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                backgroundColor: '#050510',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Glow Background */}
            <div
                style={{
                    position: 'relative',
                    marginBottom: '2.5rem',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '16rem',
                        height: '16rem',
                        inset: '-2rem',
                        borderRadius: '9999px',
                        filter: 'blur(50px)',
                        background:
                            'linear-gradient(to bottom right, rgba(99,102,241,0.12), rgba(6,182,212,0.12))',
                    }}
                />

                {/* Icon Container */}
                <div
                    style={{
                        position: 'relative',
                        width: '9rem',
                        height: '9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderRadius: '1.25rem',
                        border: '1px solid #1E1E2E',
                        background: 'rgba(17,17,24,0.5)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {/* Grid Pattern */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.2,
                            backgroundImage:
                                'radial-gradient(#1E1E2E 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                        }}
                    />

                    <MapPin
                        style={{
                            position: 'relative',
                            width: '3.2rem',
                            height: '3.2rem',
                            color: '#7C3AED',
                        }}
                    />
                </div>
            </div>

            {/* Heading */}
            <h2
                style={{
                    marginBottom: '1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    maxWidth: '700px',
                }}
            >
                Map your first codebase
            </h2>

            {/* Description */}
            <p
                style={{
                    maxWidth: '42rem',
                    marginBottom: '2rem',
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    lineHeight: '1.8rem',
                    color: '#64748B',
                }}
            >
                Connect a GitHub repo and the AI will index every file,
                function, and module for you.
            </p>

            {/* CTA Button */}
            <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    padding: '0.95rem 2rem',
                    fontSize: '1rem',
                    background:
                        'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                    boxShadow:
                        '0 8px 30px rgba(124,58,237,0.28)',
                    transition: 'all 0.3s ease',
                }}
            >
                Choose a Repository
                <ArrowRight size={18} />
            </a>

            {/* Footer Text */}
            <p
                style={{
                    marginTop: '1.5rem',
                    fontSize: '0.9rem',
                    color: '#64748B',
                }}
            >
                Works with public and private repos
            </p>
        </div>
    )
}