'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react'
import axios from "axios"
import { getSession } from "next-auth/react"
import PhaseChecklist from "./PhaseChecklist"

interface Props {
    repoName: string
    status: string
    totalFiles: number
    indexedFiles: number
    errorMessage: string | null
    repoId: string
}

const PHASES = [
    'Fetched file tree',
    'Parsed files with AST',
    'Processing module relationships...',
]

export default function IndexingCard({
    repoName,
    status,
    totalFiles,
    indexedFiles,
    errorMessage,
    repoId
}: Props) {
    const router = useRouter()
    const [dots, setDots] = useState('')
    const [retrying, setRetrying] = useState(false)

    useEffect(() => {
        if (status !== 'INDEXED' && status !== 'FAILED') {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.')
            }, 500)
            return () => clearInterval(interval)
        }
    }, [status])

    const isFailed = status === 'FAILED'
    const isDone = status === 'INDEXED'

    const progress = totalFiles > 0
        ? Math.round((indexedFiles / totalFiles) * 100)
        : 0

    const phases = PHASES.map((label, i) => ({
        label,
        done: isDone || i < 2,
        active: !isDone && !isFailed && i === 2,
    }))

    const phaseText = isFailed
        ? 'Indexing failed'
        : isDone
            ? 'Indexing complete'
            : totalFiles > 0
                ? `Generating embeddings for ${totalFiles} files${dots}`
                : `Fetching repository files${dots}`

    const handleRetry = async () => {
        setRetrying(true)
        try {
            const session = await getSession()
            const token = (session as any)?.backendToken
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${repoId}/index`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            window.location.reload()
        } catch (err) {
            console.error('Retry failed:', err)
        } finally {
            setRetrying(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Repo Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: 'white' }}>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#F1F5F9' }}>
                    {repoName || 'Loading...'}
                </span>
                {repoName && 
                    <a
                        href={`https://github.com/${repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#64748B' }}
                    >
                        <ExternalLink style={{ width: '16px', height: '16px' }} />
                    </a>
                }
            </div>

            {/* Failed View */}
            {isFailed ? (
                <FailedView
                    errorMessage={errorMessage}
                    retrying={retrying}
                    onRetry={handleRetry}
                    onBack={() => router.push('/dashboard')}
                />
            ) : (
                <>
                    {/* Processing / Done Card */}
                    <div style={{
                        width: '100%',
                        maxWidth: '660px',
                        background: 'rgba(13, 13, 26, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid #1E1E2E',
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                        borderRadius: '20px',
                        padding: '40px'
                    }}>
                        {/* Top Section — made heavier than checklist */}
                        <div style={{ paddingBottom: '28px' }}>
                            {/* Phase title row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <span style={{
                                    color: '#94A3B8',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    Current Phase
                                </span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h2 style={{
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        color: '#F1F5F9'
                                    }}>
                                        {phaseText}
                                    </h2>
                                    <span style={{
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        color: '#06B6D4'
                                    }}>
                                        {isDone ? '100%' : `${progress}%`}
                                    </span>
                                </div>
                            </div>

                            {/* Margin between title row and progress bar */}
                            <div style={{ marginTop: '20px' }}>
                                {/* Progress Bar Track */}
                                <div style={{
                                    width: '100%',
                                    height: '10px',
                                    background: '#1A1A2E',
                                    borderRadius: '99px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {/* Progress Bar Fill */}
                                    <div
                                        style={{
                                            width: `${isDone ? 100 : progress}%`,
                                            height: '100%',
                                            position: 'relative',
                                            borderRadius: '99px',
                                            background: isDone ? '#10B981' : 'linear-gradient(90deg, #6366F1 0%, #06B6D4 100%)',
                                            transition: 'width 0.5s ease',
                                            animation: !isDone ? 'progressPulse 2s ease-in-out infinite' : 'none'
                                        }}
                                    >
                                        {!isDone && (
                                            <div style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '40px',
                                                height: '40px',
                                                background: '#06B6D4',
                                                filter: 'blur(20px)',
                                                opacity: 0.6
                                            }} />
                                        )}
                                    </div>
                                </div>

                                {/* Margin below bar */}
                                <div style={{ marginBottom: '12px' }} />

                                {/* File count + AI status */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0'
                                }}>
                                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                                        {indexedFiles} / {totalFiles} files processed
                                    </span>
                                    {!isDone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#06B6D4'
                                            }} />
                                            <span style={{ fontSize: '13px', color: '#06B6D4', fontWeight: 500 }}>
                                                AI Mapping Active
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider between top section and checklist */}
                        <div style={{ height: '1px', background: '#1E1E2E' }} />

                        {/* Checklist Section */}
                        <div style={{ paddingTop: '24px' }}>
                            <PhaseChecklist phase={phases} />
                        </div>
                    </div>

                    {/* Bottom hint text */}
                    {!isDone && (
                        <p style={{
                            marginTop: '28px',
                            fontSize: '13px',
                            color: '#475569',
                            textAlign: 'center'
                        }}>
                            This usually takes 1-2 minutes for a medium-sized repo
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

function FailedView({
    errorMessage,
    retrying,
    onRetry,
    onBack,
}: {
    errorMessage: string | null
    retrying: boolean
    onRetry: () => void
    onBack: () => void
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
                <AlertTriangle style={{ width: '40px', height: '40px', color: '#EF4444' }} />
            </div>

            <h2 style={{ fontSize: '30px', fontWeight: 700, color: '#F1F5F9', marginBottom: '8px' }}>Indexing failed</h2>
            <p style={{ color: '#64748B', marginBottom: '32px' }}>We encountered a problem while mapping the repository.</p>

            <div style={{
                width: '100%',
                maxWidth: '42rem',
                background: 'rgba(17, 17, 24, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid #1E1E2E',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        background: '#0D0D14',
                        borderLeft: '2px solid #EF4444',
                        padding: '16px',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <p style={{
                            fontFamily: 'var(--font-geist-mono), monospace',
                            fontSize: '14px',
                            color: '#EF4444',
                            marginBottom: '8px',
                            fontWeight: 600
                        }}>INDEXING_ERROR</p>
                        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.625' }}>
                            {errorMessage || 'We couldn\'t process this repository. Please try again or check the repository permissions.'}
                        </p>
                    </div>

                    <div style={{
                        background: '#111118',
                        border: '1px solid #1E1E2E',
                        padding: '16px',
                        borderRadius: '12px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        <Lightbulb style={{ width: '20px', height: '20px', color: '#F59E0B', marginTop: '2px', flexShrink: 0 }} />
                        <div>
                            <p style={{ fontSize: '14px', color: '#F1F5F9', fontWeight: 500, marginBottom: '4px' }}>Quick Tip</p>
                            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.625' }}>
                                Update repository access permissions in your{' '}
                                <a
                                    href="https://github.com/settings/applications"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#06B6D4' }}
                                >
                                    GitHub application settings
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '672px' }}>
                <button
                    onClick={onRetry}
                    disabled={retrying}
                    style={{
                        flex: 1,
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: retrying ? undefined : '#6366F1',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '12px',
                        border: 'none',
                        opacity: retrying ? 0.5 : 1,
                        fontSize: 'inherit'
                    }}
                >
                    {retrying ? 'Retrying...' : 'Retry Indexing'}
                    <ArrowRight style={{ marginLeft: '8px', width: '16px', height: '16px' }} />
                </button>
                <button
                    onClick={onBack}
                    style={{
                        flex: 1,
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #1E1E2E',
                        color: '#F1F5F9',
                        fontWeight: 500,
                        borderRadius: '12px',
                        background: 'transparent',
                        fontSize: 'inherit'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>

            <p style={{
                marginTop: '32px',
                fontSize: '12px',
                color: '#64748B',
                textAlign: 'center',
                maxWidth: '384px'
            }}>
                Still failing? Try re-connecting your GitHub account in{' '}
                <a href="/settings" style={{ color: '#64748B' }}>Settings</a>{' '}
                or contact support.
            </p>
        </div>
    )
}
