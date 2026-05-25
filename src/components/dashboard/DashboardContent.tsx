'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardNav from './DashboardNav'
import DashboardStarfield from './DashboardStarfield'
import EmptyState from './EmptyState'
import OnboardingBanner from './OnboardingBanner'
import RepoGrid from './RepoGrid'
import RepoSearch from './RepoSearch'
import type { RepoCardProps } from './RepoCard'

interface DashboardContentProps {
    repos: RepoCardProps[]
}

export default function DashboardContent({ repos }: DashboardContentProps) {
    const [query, setQuery] = useState('')
    const hasRepos = repos.length > 0

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return repos
        return repos.filter(
            (r) =>
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.language?.toLowerCase().includes(q),
        )
    }, [repos, query])

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
                {!hasRepos ? (
                    <EmptyState />
                ) : (
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