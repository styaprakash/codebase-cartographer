'use client'

import Link from 'next/link'
import {
    AlertTriangle,
    ChevronRight,
    DatabaseBackup,
    FolderGit2,
    RefreshCw,
    Zap,
} from 'lucide-react'
import { useCallback, useRef } from 'react'

export type RepoStatus = 'ready' | 'indexing' | 'not_indexed' | 'failed'

export interface RepoCardProps {
    title: string
    description: string
    language?: string
    languageColor?: string
    status: RepoStatus
    indexingProgress?: number
    indexingDetail?: string
    actionLabel?: 'Open' | 'Index Repo' | 'Retry'
    actionUrl?: string
    repoId?: string
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#60A5FA',
    Python: '#FACC15',
    Markdown: '#94A3B8',
    Fortran: '#FB923C',
    Go: '#06B6D4',
}

function StatusBadge({ status }: { status: RepoStatus }) {
    if (status === 'ready') {
        return (
            <span className="rounded-md border border-green/20 bg-green/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green">
                Ready
            </span>
        )
    }
    if (status === 'indexing') {
        return (
            <span className="cc-status-indexing rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Indexing...
            </span>
        )
    }
    if (status === 'failed') {
        return (
            <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
                Failed
            </span>
        )
    }
    return (
        <span className="rounded-md border border-[#2D2D3F] bg-[#1E1E2E] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Not indexed
        </span>
    )
}

function IconBox({ status }: { status: RepoStatus }) {
    const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'
    if (status === 'ready') {
        return (
            <div className={`${base} bg-indigo/10`}>
                <FolderGit2 className="h-6 w-6 text-indigo" />
            </div>
        )
    }
    if (status === 'indexing') {
        return (
            <div className={`${base} bg-amber-500/10`}>
                <RefreshCw className="h-6 w-6 animate-spin text-amber-500" style={{ animationDuration: '3s' }} />
            </div>
        )
    }
    if (status === 'failed') {
        return (
            <div className={`${base} bg-red-900/10`}>
                <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
        )
    }
    return (
        <div className={`${base} bg-[#1E1E2E]`}>
            <DatabaseBackup className="h-6 w-6 text-text-muted" />
        </div>
    )
}

export default function RepoCard({
    title,
    description,
    language,
    languageColor,
    status,
    indexingProgress = 65,
    indexingDetail = 'Analyzing files...',
    actionLabel,
    actionUrl = '#',
    repoId,
}: RepoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const dotColor = languageColor ?? (language ? LANGUAGE_COLORS[language] : undefined) ?? '#64748B'

    const glassClass =
        status === 'not_indexed'
            ? 'cc-dashboard-glass cc-dashboard-glass--dashed'
            : status === 'failed'
              ? 'cc-dashboard-glass cc-dashboard-glass--failed'
              : 'cc-dashboard-glass'

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)

        const xc = rect.width / 2
        const yc = rect.height / 2
        const dx = x - xc
        const dy = y - yc
        if (window.matchMedia('(min-width: 768px)').matches) {
            card.style.transform = `perspective(1000px) rotateX(${-dy / 25}deg) rotateY(${dx / 25}deg) translateY(-4px) scale(1.02)`
        }
    }, [])

    const onMouseLeave = useCallback(() => {
        const card = cardRef.current
        if (!card) return
        card.style.transform = ''
    }, [])

    const href = actionUrl || (repoId ? `/repo/${repoId}` : '#')

    return (
        <div
            ref={cardRef}
            className={`${glassClass} flex flex-col rounded-2xl p-6`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className="mb-4 flex items-start justify-between">
                <IconBox status={status} />
                <StatusBadge status={status} />
            </div>

            <h3 className="mb-2 truncate text-lg font-bold text-text-primary">{title}</h3>
            <p className="mb-4 line-clamp-2 flex-grow text-sm text-text-muted">{description}</p>

            {status === 'indexing' && (
                <>
                    <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-200"
                            style={{ width: `${indexingProgress}%` }}
                        />
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted">{indexingDetail}</span>
                        <span className="text-[10px] font-bold text-amber-500">{indexingProgress}%</span>
                    </div>
                </>
            )}

            {status !== 'indexing' && (
                <div className="mt-auto flex items-center gap-4">
                    {language && (
                        <span className="flex items-center gap-1.5 text-xs text-text-muted">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: dotColor }}
                            />
                            {language}
                        </span>
                    )}

                    {actionLabel === 'Open' && (
                        <Link
                            href={href}
                            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-green px-4 py-2 text-xs font-bold text-white no-underline transition-colors hover:bg-[#059669]"
                        >
                            Open
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    )}

                    {actionLabel === 'Index Repo' && (
                        <Link
                            href={href}
                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-indigo/30 bg-indigo/10 px-4 py-2 text-xs font-bold text-indigo no-underline transition-colors hover:bg-indigo/20"
                        >
                            Index Repo
                            <Zap className="h-3.5 w-3.5" />
                        </Link>
                    )}

                    {actionLabel === 'Retry' && (
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/10"
                        >
                            Retry
                            <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
