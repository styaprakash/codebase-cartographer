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
            <span className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
                Ready
            </span>
        )
    }
    if (status === 'indexing') {
        return (
            <span className="status-badge-indexing rounded-xl border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                Indexing...
            </span>
        )
    }
    if (status === 'failed') {
        return (
            <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-red-500">
                Failed
            </span>
        )
    }
    return (
        <span className="rounded-xl border border-[#2D2D3F] bg-[#1E1E2E] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Not indexed
        </span>
    )
}

function IconBox({ status }: { status: RepoStatus }) {
    const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'
    if (status === 'ready') {
        return (
            <div className={`${base} bg-[#6366F1]/10`}>
                <FolderGit2 className="h-6 w-6 text-[#6366F1]" />
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
            <DatabaseBackup className="h-6 w-6 text-[#64748B]" />
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
            ? 'glass-card border-dashed !bg-transparent'
            : status === 'failed'
                ? 'glass-card !border-red-900/50'
                : 'glass-card'

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
            className={`${glassClass} flex w-full flex-col rounded-xl p-5`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className="mb-4 flex items-start justify-between">
                <IconBox status={status} />
                <StatusBadge status={status} />
            </div>

            <h3 className="mb-1 text-base font-semibold tracking-tight text-[#F8FAFC]">{title}</h3>
            <p className="mb-3 line-clamp-2 flex-grow text-sm leading-5 text-[#94A3B8]">{description}</p>

            {status === 'indexing' && (
                <div className="mt-auto">
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FDE68A]"
                            style={{ width: `${indexingProgress}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">{indexingDetail}</span>
                        <span className="text-[11px] font-bold text-[#F59E0B]">{indexingProgress}%</span>
                    </div>
                </div>
            )}

            {status !== 'indexing' && (
                <div className="mt-auto flex items-center gap-4">
                    {language && (
                        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
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
                            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-xs font-bold text-white no-underline transition-colors hover:bg-[#059669]"
                        >
                            Open
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    )}

                    {actionLabel === 'Index Repo' && (
                        <Link
                            href={href}
                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-2 text-xs font-bold text-[#6366F1] no-underline transition-colors hover:bg-[#6366F1]/20"
                        >
                            Index Repo
                            <Zap className="h-3.5 w-3.5" />
                        </Link>
                    )}

                    {actionLabel === 'Retry' && (
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-500/50 h-10 px-5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
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
