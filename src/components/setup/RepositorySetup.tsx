'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import { ArrowRight, Loader2 } from 'lucide-react'
import type { GithubRepo } from '@/types'
import RepoSummaryCard from './RepoSummaryCard'
import ModelSelectionSection from './ModelSelectionSection'
import PipelineVisualization from './PipelineVisualization'
import ProcessingEstimates from './ProcessingEstimates'

interface Props {
    repo: GithubRepo
}

export default function RepositorySetup({ repo }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedModel, setSelectedModel] = useState<string>('OPENROUTER_QWEN_EMBEDDING')
    const router = useRouter()

    const handleStartIndexing = async () => {
        setLoading(true)
        setError(null)
        try {
            const session = await getSession()
            const token = (session as any)?.backendToken

            const { data: created } = await axios.post(
                `/api/proxy/repos`,
                {
                    githubRepoId: String(repo.id),
                    name: String(repo.name),
                    fullName: String(repo.full_name),
                    branch: String(repo.default_branch),
                    language: String(repo.language ?? 'Unknown'),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            try {
                await axios.post(
                    `/api/proxy/repos/${created.id}/index`,
                    { embeddingModel: selectedModel },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
            } catch (innerErr) {
                if (axios.isAxiosError(innerErr) && innerErr.response?.status === 409) {
                    console.warn('Indexing already in progress (409). Proceeding to SSE stream.')
                } else {
                    throw innerErr
                }
            }

            router.push(`/indexing/${created.id}`)
        } catch (err) {
            console.error('Failed to start indexing:', err)
            setError('Failed to start indexing. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
                <a href="/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</a>
                <span>/</span>
                <span style={{ color: '#94A3B8' }}>Setup</span>
                <span>/</span>
                <span style={{ color: '#F1F5F9', fontWeight: 500 }}>{repo.name}</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>
                Prepare Your Repository
            </h1>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                Review your repository details, learn how Codebase Cartographer works, and start indexing.
            </p>

            {/* 1. Repository Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    Step 1 · Review
                </p>
                <RepoSummaryCard
                    name={repo.name}
                    owner={repo.full_name.split('/')[0]}
                    language={repo.language ?? 'Unknown'}
                    branch={repo.default_branch}
                />
            </div>

            {/* 2. Embedding Engine */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    Step 2 · Engine
                </p>
                <ModelSelectionSection
                    selectedModel={selectedModel}
                    onSelectModel={setSelectedModel}
                />
            </div>

            {/* 3. How It Works */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    Step 3 · How Codebase Cartographer Works
                </p>
                <PipelineVisualization />
            </div>

            {/* 4. What Happens During Indexing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    Step 4 · What to Expect
                </p>
                <ProcessingEstimates />
            </div>

            {error && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#EF4444',
                    fontSize: '13px',
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
                <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: '1px solid #1E1E2E',
                        background: 'transparent',
                        color: '#94A3B8',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleStartIndexing}
                    disabled={loading}
                    style={{
                        padding: '12px 28px',
                        borderRadius: '12px',
                        border: 'none',
                        background: loading ? '#1E1E2E' : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                        color: loading ? '#475569' : 'white',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            Starting...
                        </>
                    ) : (
                        <>
                            Start Indexing
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
