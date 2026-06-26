'use client'

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ExternalLink, AlertTriangle, Lightbulb, ArrowRight, Cpu, GitBranch, Info } from 'lucide-react'
import axios from "axios"
import { getSession } from "next-auth/react"
import LiveFileFeed from "./LiveFileFeed"
import ProgressTimeline, { type TimelinePhase } from "./ProgressTimeline"
import EducationalTip from "./EducationalTip"
import ProgressStats from "./ProgressStats"
import RepositoryReady from "./RepositoryReady"

interface Props {
    repoName: string
    status: string
    totalFiles: number
    indexedFiles: number
    percentage: number
    currentFile: string | null
    completedFiles: string[]
    errorMessage: string | null
    repoId: string
}

const PIPELINE_PHASES = [
    'Repository Retrieved',
    'Files Parsed',
    'Generating Embeddings',
    'Storing Vectors',
    'Ready',
]

function IndexingCard({
    repoName,
    status,
    totalFiles,
    indexedFiles,
    percentage,
    currentFile,
    completedFiles,
    errorMessage,
    repoId,
}: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const branchParam = searchParams.get('branch') || 'main'
    const [dots, setDots] = useState('')
    const [retrying, setRetrying] = useState(false)
    const [showReady, setShowReady] = useState(false)
    const [processingTime, setProcessingTime] = useState('')

    const isFailed = status === 'FAILED'
    const isDone = status === 'INDEXED'
    const progress = percentage

    console.log('Current UI State:', { status: status, total: totalFiles, indexed: indexedFiles })

    useEffect(() => {
        if (status !== 'INDEXED' && status !== 'FAILED') {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.')
            }, 500)
            return () => clearInterval(interval)
        }
    }, [status])

    useEffect(() => {
        if (isDone) {
            const startTime = sessionStorage.getItem(`indexing-start-${repoId}`)
            if (startTime) {
                const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000)
                const mins = Math.floor(elapsed / 60)
                const secs = elapsed % 60
                setProcessingTime(`${mins}m ${secs}s`)
            } else {
                setProcessingTime('~2-3 minutes')
            }
            const timer = setTimeout(() => setShowReady(true), 800)
            return () => clearTimeout(timer)
        } else if (status === 'INDEXING') {
            if (!sessionStorage.getItem(`indexing-start-${repoId}`)) {
                sessionStorage.setItem(`indexing-start-${repoId}`, String(Date.now()))
            }
        }
    }, [isDone, repoId])

    const activePhaseIndex = isDone ? 4 : isFailed ? -1 : indexedFiles === 0 ? 0 : indexedFiles < totalFiles / 2 ? 1 : 2

    const phases: TimelinePhase[] = PIPELINE_PHASES.map((label, i) => ({
        label,
        done: isDone || i < activePhaseIndex,
        active: !isDone && !isFailed && i === activePhaseIndex,
    }))

    const handleRetry = async () => {
        setRetrying(true)
        try {
            const session = await getSession()
            const token = (session as any)?.backendToken
            try {
                await axios.post(
                    `/api/proxy/repos/${repoId}/index`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } catch (innerErr) {
                if (axios.isAxiosError(innerErr) && innerErr.response?.status === 409) {
                    console.warn('Indexing already in progress (409). Reloading stream.')
                } else {
                    throw innerErr
                }
            }
            window.location.reload()
        } catch (err) {
            console.error('Retry failed:', err)
        } finally {
            setRetrying(false)
        }
    }

    if (isDone && showReady) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}>
                <RepositoryReady
                    repoId={repoId}
                    totalFiles={totalFiles}
                    model="Qwen3 Embedding"
                    processingTime={processingTime}
                />
            </div>
        )
    }

    if (isFailed) {
        return (
            <FailedView
                errorMessage={errorMessage}
                retrying={retrying}
                onRetry={handleRetry}
                onBack={() => router.push('/dashboard')}
            />
        )
    }

    return (
        <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Bar — model + branch + repo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                background: 'rgba(13, 13, 26, 0.8)',
                border: '1px solid #1E1E2E',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <Cpu size={14} color="#818CF8" />
                        <span style={{ fontSize: '12px', color: '#818CF8', fontWeight: 500 }}>Qwen3 Embedding</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                        <GitBranch size={14} color="#06B6D4" />
                        <span style={{ fontSize: '12px', color: '#06B6D4', fontWeight: 500 }}>{branchParam}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9' }}>{repoName || 'Loading...'}</span>
                    {repoName &&
                        <a href={`https://github.com/${repoName}`} target="_blank" rel="noopener noreferrer" style={{ color: '#64748B' }}>
                            <ExternalLink size={14} />
                        </a>
                    }
                </div>
            </div>

            {/* Main content grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
                {/* Left — Processing Activity Preview */}
                <div style={{
                    background: 'rgba(13, 13, 26, 0.95)',
                    border: '1px solid #1E1E2E',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1E1E2E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Processing Activity
                            </span>
                            <div title="Live file processing stream from backend.">
                                <Info size={12} color="#475569" />
                            </div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#475569' }}>
                            {indexedFiles} / {totalFiles} files
                        </span>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <LiveFileFeed completedFiles={completedFiles} currentFile={currentFile} />
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        borderTop: '1px solid #1E1E2E',
                        fontSize: '11px',
                        color: '#475569',
                        textAlign: 'center',
                    }}>
                        Streaming live from backend
                    </div>
                </div>

                {/* Right — Timeline + Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        background: 'rgba(13, 13, 26, 0.95)',
                        border: '1px solid #1E1E2E',
                        borderRadius: '14px',
                        padding: '20px',
                    }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', display: 'block' }}>
                            Progress Timeline
                        </span>
                        <ProgressTimeline phases={phases} />
                    </div>

                    <EducationalTip />
                </div>
            </div>

            {/* Bottom — Progress Stats */}
            <div style={{
                background: 'rgba(13, 13, 26, 0.95)',
                border: '1px solid #1E1E2E',
                borderRadius: '14px',
                padding: '20px',
            }}>
                <ProgressStats
                    indexedFiles={indexedFiles}
                    totalFiles={totalFiles}
                    isDone={isDone}
                    progress={progress}
                />
                {!isDone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06B6D4', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                        <span style={{ fontSize: '12px', color: '#06B6D4', fontWeight: 500 }}>
                            AI actively processing{dots}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default React.memo(IndexingCard)

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '672px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
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
                    Try Another Repository
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
