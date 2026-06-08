'use client'

import { ArrowRight, CheckCircle2, Clock, Cpu, FileText, Layers, MessageSquare, Network, Search, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    repoId: string
    totalFiles: number
    totalChunks: number
    model: string
    processingTime: string
}

const NEXT_STEPS = [
    { icon: MessageSquare, label: 'Ask architecture questions', desc: 'Query your codebase in natural language' },
    { icon: Network, label: 'Explore dependencies', desc: 'Visualize module relationships and import chains' },
    { icon: Search, label: 'Find implementation details', desc: 'Search for specific functions, classes, and patterns' },
    { icon: BookOpen, label: 'Search your code semantically', desc: 'Find related code across your entire repository' },
]

export default function RepositoryReady({ repoId, totalFiles, totalChunks, model, processingTime }: Props) {
    const router = useRouter()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '640px',
            animation: 'fadeInScale 0.6s ease-out',
        }}>
            {/* Icon */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
            }}>
                <CheckCircle2 size={40} color="#10B981" />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
                Repository Indexed Successfully!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '32px', margin: '8px 0 32px 0', textAlign: 'center' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                        <FileText size={18} color="#10B981" />
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Files Indexed</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>{totalFiles.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                        <Layers size={18} color="#818CF8" />
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Chunks Generated</p>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>{totalChunks.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                        <Cpu size={18} color="#06B6D4" />
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Embedding Engine</p>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: 0 }}>{model}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                        <Clock size={18} color="#F59E0B" />
                        <div>
                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Processing Time</p>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: 0 }}>{processingTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What Happens Next */}
            <div style={{
                width: '100%',
                background: 'rgba(17, 17, 24, 0.8)',
                border: '1px solid #1E1E2E',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '28px',
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
                                    width: '32px',
                                    height: '32px',
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
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                    type="button"
                    onClick={() => router.push(`/repo/${repoId}`)}
                    style={{
                        flex: 1,
                        padding: '14px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'opacity 0.2s ease',
                    }}
                >
                    Start Exploring
                    <ArrowRight size={18} />
                </button>
            </div>

            <p style={{ marginTop: '20px', fontSize: '12px', color: '#475569' }}>
                <a href="/dashboard" style={{ color: '#64748B' }}>Back to Dashboard</a>
            </p>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    )
}
