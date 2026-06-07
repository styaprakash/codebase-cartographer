'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useRepos } from '@/hooks/useRepos'
import DashboardNav from './DashboardNav'
import DashboardStarfield from './DashboardStarfield'
import EmptyState from './EmptyState'
import OnboardingBanner from './OnboardingBanner'
import RepoGrid from './RepoGrid'
import RepoSearch from './RepoSearch'
import type { DashboardRepo } from '@/types'
import type { RepoCardProps } from './RepoCard'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import axios from 'axios';

const STORAGE_KEY = 'optimistic-indexing-ids'
const STALE_MS = 5 * 60 * 1000

function loadOptimisticIds(): number[] {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const entries: { id: number; ts: number }[] = JSON.parse(raw)
        return entries.filter(e => Date.now() - e.ts < STALE_MS).map(e => e.id)
    } catch { return [] }
}

function saveOptimisticId(id: number) {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        const entries: { id: number; ts: number }[] = raw ? JSON.parse(raw) : []
        entries.push({ id, ts: Date.now() })
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch { /* noop */ }
}

export default function DashboardContent() {
    const [query, setQuery] = useState('')
    const [optimisticIndexingIds, setOptimisticIndexingIds] = useState<Set<number>>(
        () => new Set(loadOptimisticIds())
    )
    const { repos, isLoading, error, refresh } = useRepos()

    const router = useRouter()

    const handleIndexRepo = useCallback(async (repo: DashboardRepo) => {
        try {
            const session = await getSession()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any)?.backendToken

            // Repo already exists in backend — branch on its status
            if (repo.backendId) {
                if (repo.status === 'INDEXING') {
                    router.push(`/indexing/${repo.backendId}`)
                    return
                }
                if (repo.status === 'INDEXED') {
                    router.push(`/repo/${repo.backendId}`)
                    return
                }
                // FAILED — retry index with current GitHub metadata (handles renames)
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${repo.backendId}/index`,
                    {
                        name: repo.name,
                        fullName: repo.fullName,
                        branch: repo.branch,
                        language: repo.language,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                router.push(`/indexing/${repo.backendId}`)
                return
            }

            // No backendId — create repo then trigger indexing
            setOptimisticIndexingIds(prev => new Set(prev).add(repo.githubId))
            saveOptimisticId(repo.githubId)

            const { data: created } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/repos`,
                {
                    githubRepoId: String(repo.githubId),
                    name: String(repo.name),
                    fullName: String(repo.fullName),
                    branch: String(repo.branch),
                    language: String(repo.language) ?? 'Unknown'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${created.id}/index`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            router.push(`/indexing/${created.id}`)
        } catch(err){
            setOptimisticIndexingIds(prev => {
                const next = new Set(prev)
                next.delete(repo.githubId)
                return next
            })
            console.error('Failed to start indexing: ', err);
        }
    }, [router])

    // Force re-fetch on mount so stale cache is replaced with fresh backend data
    useEffect(() => { refresh() }, [refresh])

    //Map DahboardRepo -> RepoCards for the grid
    const cardProps: RepoCardProps[] = useMemo(()=> {
        // Remove stale optimistic entries that the backend has now confirmed
        const backendConfirmed = new Set(
            repos.filter(r => r.status !== 'NOT_INDEXED').map(r => r.githubId)
        )
        return repos.map((repo) => {
            const isOptimistic = optimisticIndexingIds.has(repo.githubId)
                && !backendConfirmed.has(repo.githubId)
            const effectiveStatus = isOptimistic ? 'INDEXING' : repo.status

            return {
                title: repo.name,
                description: repo.description,
                language: repo.language ?? undefined,
                status: mapStatus(effectiveStatus),
                indexingProgress: repo.totalFiles > 0
                    ? Math.round((repo.indexedFiles / repo.totalFiles) * 100) : 0,
                indexingDetail: `Analyzing ${repo.indexedFiles}/${repo.totalFiles} files....`,
                actionLabel: isOptimistic ? undefined : getActionLabel(repo.status),
                repoId: repo.backendId ?? undefined,
                onIndexClick: () => handleIndexRepo(repo),
            }
        })
    },[repos, optimisticIndexingIds, handleIndexRepo])


    // Filter by search query
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return cardProps
        return cardProps.filter(
            (r) =>
                r.title.toLowerCase().includes(q) ||
                (r.description ?? '').toLowerCase().includes(q) ||
                (r.language ?? '').toLowerCase().includes(q),
        )
    }, [cardProps, query])
    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: '#F1F5F9', overflowX: 'hidden' }}>
            <DashboardStarfield />
            <DashboardNav />

            <main
                style={{
                    paddingTop: '85px',
                    paddingBottom: '56px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    position: 'relative',
                    zIndex: 10,
                    maxWidth: '1280px',
                    margin: '0 auto',
                    width: '100%',
                }}
            >   
                {/* Loading state */}
                {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: 200, height: 36, borderRadius: 8, background: '#1E1E2E', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: 100, height: 36, borderRadius: 10, background: '#1E1E2E', animation: 'pulse 1.5s infinite' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ height: 200, borderRadius: 14, background: '#0D0D1A', border: '1px solid #1E1E2E', animation: 'pulse 1.5s infinite' }} />
                    ))}
                    </div>
                </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#EF4444' }}>
                    <p style={{ fontSize: 16, fontWeight: 500 }}>Failed to load repositories</p>
                    <p style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>{error.message}</p>
                </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && repos.length === 0 && <EmptyState />}

                {/* Repos */}
                {!isLoading && !error && repos.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                                Your Repositories
                            </h1>
                            <button
                                type="button"
                                // Find the button and replace its style object with:
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '9px 16px',
                                    borderRadius: '10px',
                                    background: '#111118',
                                    border: '1px solid #2D2D3F',
                                    color: '#F1F5F9',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                <Plus size={16} />
                                New Repo
                            </button>
                        </div>

                        {/* Onboarding + Search */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <OnboardingBanner />
                            <RepoSearch value={query} onChange={setQuery} />
                        </div>

                        <RepoGrid repos={filtered} />
                    </div>
                )}
            </main>
        </div>
    )
}

// ── Helpers ───────────────────────────────────────────────────
function mapStatus(status: DashboardRepo['status']): RepoCardProps['status'] {
    const map = {
        INDEXED:     'ready',
        INDEXING:    'indexing',
        PENDING:     'queued',
        FAILED:      'failed',
        NOT_INDEXED: 'not_indexed',
    } as const
    return map[status]
}

function getActionLabel(status: DashboardRepo['status']): RepoCardProps['actionLabel'] {
    if (status === 'INDEXED')     return 'Open'
    if (status === 'FAILED')      return 'Retry'
    if (status === 'NOT_INDEXED') return 'Index Repo'
    if (status === 'PENDING')     return 'Queued'
    return undefined
}