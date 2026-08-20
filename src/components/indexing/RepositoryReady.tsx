'use client'

import { ArrowRight, CheckCircle2, Clock, Cpu, FileText, Layers, MessageSquare, Network, Search, BookOpen, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface Props {
    repoId: string
    totalFiles: number
    model: string
    processingTime: string
}

const NEXT_STEPS = [
    { icon: MessageSquare, label: 'Ask architecture questions', desc: 'Query your codebase in natural language' },
    { icon: Network, label: 'Explore dependencies', desc: 'Visualize module relationships and import chains' },
    { icon: Search, label: 'Find implementation details', desc: 'Search for specific functions, classes, and patterns' },
    { icon: BookOpen, label: 'Search your code semantically', desc: 'Find related code across your entire repository' },
]

export default function RepositoryReady({ repoId, totalFiles, model, processingTime }: Props) {
    const router = useRouter()
    const [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366F1', '#10B981', '#F59E0B', '#06B6D4']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366F1', '#10B981', '#F59E0B', '#06B6D4']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const handleExplore = () => {
        setIsClicked(true)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            router.push(`/repo/${repoId}`)
        }, 500)
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            animation: 'fadeInScale 0.6s ease-out',
        }}>
            {/* Icon */}
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
            }}>
                <CheckCircle2 size={32} color="#10B981" />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
                Repository Indexed Successfully!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '20px', margin: '4px 0 20px 0', textAlign: 'center' }}>
                Your codebase is ready for AI-powered exploration.
            </p>

            {/* Summary Card */}
            <div style={{
                width: '100%',
                background: 'rgba(17, 17, 24, 0.8)',
                border: '1px solid #1E1E2E',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '28px',
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div className="running-border">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118', height: '100%' }}>
                            <FileText size={18} color="#10B981" />
                            <div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Files Indexed</p>
                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>{totalFiles.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="running-border">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118', height: '100%' }}>
                            <Cpu size={18} color="#06B6D4" />
                            <div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Embedding Engine</p>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: 0 }}>{model}</p>
                            </div>
                        </div>
                    </div>
                    <div className="running-border">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118', height: '100%' }}>
                            <Clock size={18} color="#F59E0B" />
                            <div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Processing Time</p>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: 0 }}>{processingTime}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bouncing arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '20px', animation: 'bounce 2s infinite' }}>
                <ChevronDown size={24} color="#6366F1" style={{ opacity: 0.8 }} />
                <ChevronDown size={24} color="#6366F1" style={{ marginTop: '-14px', opacity: 0.4 }} />
            </div>

            {/* What Happens Next */}
            <div style={{
                width: '100%',
                background: 'rgba(17, 17, 24, 0.8)',
                border: '1px solid #1E1E2E',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px',
            }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: '0 0 16px 0' }}>
                    What happens next?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {NEXT_STEPS.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={16} color="#818CF8" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#F1F5F9', margin: 0 }}>{step.label}</p>
                                    <p style={{ fontSize: '12px', color: '#64748B', margin: '1px 0 0 0' }}>{step.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'center' }}>
                <a href="/dashboard" style={{ 
                    color: '#94A3B8', 
                    fontSize: '15px', 
                    fontWeight: 500,
                    textDecoration: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: '1px solid #1E1E2E',
                    background: 'rgba(17, 17, 24, 0.5)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(17, 17, 24, 0.9)'
                    e.currentTarget.style.color = '#F1F5F9'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(17, 17, 24, 0.5)'
                    e.currentTarget.style.color = '#94A3B8'
                }}>
                    Back to Dashboard
                </a>
                
                <button
                    type="button"
                    onClick={handleExplore}
                    style={{
                        flex: 1,
                        padding: '16px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
                        animation: isClicked ? 'none' : 'slowBlink 2.5s infinite ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                        if (!isClicked) e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.5)'
                        e.currentTarget.style.animation = 'none'
                    }}
                    onMouseLeave={(e) => {
                        if (!isClicked) {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.animation = 'slowBlink 2.5s infinite ease-in-out'
                        }
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    Start Exploring
                    <ArrowRight size={18} />
                </button>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes slowBlink {
                    0%, 100% { opacity: 1; filter: brightness(1); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
                    50% { opacity: 0.9; filter: brightness(1.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
                }
                @keyframes borderRun {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .running-border {
                    position: relative;
                    padding: 1px;
                    border-radius: 11px;
                    background: linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.6) 50%, rgba(99,102,241,0.1) 100%);
                    background-size: 200% 200%;
                    animation: borderRun 3s linear infinite;
                }
            `}</style>
        </div>
    )
}
