'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardCursor from './DashboardCursor'
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
        <div className="cc-dashboard-page relative">
            <DashboardStarfield />
            <DashboardCursor />
            <DashboardNav />

            <main className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 pb-12 pt-24 md:px-8">
                {!hasRepos ? (
                    <EmptyState />
                ) : (
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h1 className="text-4xl font-bold tracking-tight text-text-primary">
                                    Your Repositories
                                </h1>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg border border-[#2D2D3F] bg-[#1E1E2E] px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-[#2D2D3F]"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Repo
                                </button>
                            </div>

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
