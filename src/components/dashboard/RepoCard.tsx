'use client'

import Link from 'next/link'
import { AlertTriangle, ChevronRight, Clock, DatabaseBackup, FolderGit2, RefreshCw, Zap } from 'lucide-react'
import { useCallback, useRef } from 'react'

export type RepoStatus = 'indexed' | 'indexing' | 'not_indexed' | 'failed' | 'queued'

export interface RepoCardProps {
    title: string
    description: string
    language?: string
    languageColor?: string
    status: RepoStatus
    indexingProgress?: number
    indexingDetail?: string
    actionLabel?: 'Open' | 'Index Repo' | 'Retry' | 'Queued' | 'Indexing...'
    actionUrl?: string
    repoId?: string
    branch?: string
    onIndexClick?: () => void
    onClick?: () => void
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#60A5FA',
    Python: '#FACC15',
    Markdown: '#94A3B8',
    Fortran: '#FB923C',
    Go: '#06B6D4',
}

function StatusBadge({ status }: { status: RepoStatus }) {
    const base: React.CSSProperties = {
        borderRadius: 8, padding: '3px 8px',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.06em', textTransform: 'uppercase',
    }
    if (status === 'indexed') return (
        <span style={{ ...base, border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>Indexed</span>
    )
    if (status === 'indexing') return (
        <span style={{ ...base, border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>Indexing...</span>
    )
    if (status === 'failed') return (
        <span style={{ ...base, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>Failed</span>
    )
    if (status === 'queued') return (
        <span style={{ ...base, border: '1px solid rgba(161,161,170,0.25)', background: 'rgba(161,161,170,0.1)', color: '#A1A1AA' }}>Queued</span>
    )
    return (
        <span style={{ ...base, border: '1px solid #2D2D3F', background: '#1A1A2E', color: '#64748B' }}>Not Indexed</span>
    )
}

function IconBox({ status }: { status: RepoStatus }) {
    const box: React.CSSProperties = {
        width: 40, height: 40, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    }
    if (status === 'indexed') return (
        <div style={{ ...box, background: 'rgba(99,102,241,0.15)' }}>
            <FolderGit2 size={20} color="#6366F1" />
        </div>
    )
    if (status === 'indexing') return (
        <div style={{ ...box, background: 'rgba(245,158,11,0.15)' }}>
            <RefreshCw size={20} color="#F59E0B" style={{ animation: 'spin 3s linear infinite' }} />
        </div>
    )
    if (status === 'failed') return (
        <div style={{ ...box, background: 'rgba(239,68,68,0.1)' }}>
            <AlertTriangle size={20} color="#EF4444" />
        </div>
    )
    if (status === 'queued') return (
        <div style={{ ...box, background: 'rgba(161,161,170,0.15)' }}>
            <Clock size={20} color="#A1A1AA" />
        </div>
    )
    return (
        <div style={{ ...box, background: '#1A1A2E' }}>
            <DatabaseBackup size={20} color="#64748B" />
        </div>
    )
}

export default function RepoCard({
    title, description, language, languageColor,
    status, indexingProgress = 65,
    indexingDetail = 'Analyzing files...',
    actionLabel, actionUrl = '', repoId, branch, onIndexClick, onClick,
}: RepoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const dotColor = languageColor ?? (language ? LANGUAGE_COLORS[language] : undefined) ?? '#64748B'
    const href = actionUrl || (repoId ? `/repo/${repoId}` : '#')

    const borderColor = status === 'failed'
        ? 'rgba(239,68,68,0.3)'
        : status === 'not_indexed'
            ? '#1E1E2E'
            : '#1E1E2E'

    const cardStyle: React.CSSProperties = {
        background: 'rgba(17, 17, 24, 0.6)',
        border: `1px ${status === 'not_indexed' ? 'dashed' : 'solid'} ${borderColor}`,
        borderRadius: 14,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        minHeight: '200px',
        position: 'relative',
        overflow: 'hidden',
    }

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
        card.style.transform = `perspective(1000px) rotateX(${-dy / 25}deg) rotateY(${dx / 25}deg) translateY(-4px) scale(1.02)`
        card.style.borderColor = '#6366F1'
        card.style.boxShadow = '0 10px 40px -10px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)'
        
        if (glowRef.current) {
            glowRef.current.style.opacity = '1'
        }
    }, [])

    const onMouseLeave = useCallback(() => {
        const card = cardRef.current
        if (!card) return
        card.style.transform = ''
        card.style.borderColor = borderColor
        card.style.boxShadow = ''
        
        if (glowRef.current) {
            glowRef.current.style.opacity = '0'
        }
    }, [borderColor])

    return (
        <div ref={cardRef} style={cardStyle} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onClick={onClick}>
            
            <div 
                ref={glowRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15) 0%, transparent 80%)',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 0,
                }} 
            />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top row — icon + badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <IconBox status={status} />
                <StatusBadge status={status} />
            </div>

            {/* Title */}
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', marginBottom: 6, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {title}
                {branch && status !== 'not_indexed' && (
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                            <path d="M6 3v12a4 4 0 0 0 4 4h4" />
                            <path d="M18 17l4-4-4-4" />
                            <path d="M14 21l4-4-4-4" />
                        </svg>
                        {branch}
                    </span>
                )}
            </h3>

            {/* Description */}
            <p style={{
                fontSize: 13, color: '#94A3B8', lineHeight: 1.5, flexGrow: 1, marginBottom: 16,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
            }}>
                {description}
            </p>

            {/* Queued helper text */}
            {status === 'queued' && (
                <p style={{ fontSize: 12, color: '#A1A1AA', fontStyle: 'italic', marginBottom: 16, marginTop: 0 }}>
                    Waiting for indexing worker — Job has been queued
                </p>
            )}

            {/* Indexing progress */}
            {status === 'indexing' && (
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ height: 5, background: '#1E1E2E', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{
                            height: '100%', borderRadius: 99,
                            background: 'linear-gradient(90deg, #F59E0B, #FDE68A)',
                            width: `${indexingProgress}%`,
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: '#64748B' }}>{indexingDetail}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B' }}>{indexingProgress}%</span>
                    </div>
                </div>
            )}

            {/* Footer — language + action */}
            {status !== 'indexing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                    {language && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                            {language}
                        </span>
                    )}

                    {actionLabel === 'Open' && (
                        <Link href={href} style={{
                            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 8,
                            background: '#10B981', color: 'white',
                            fontSize: 12, fontWeight: 700, textDecoration: 'none',
                        }}>
                            Open <ChevronRight size={13} />
                        </Link>
                    )}

                    {actionLabel === 'Index Repo' && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onIndexClick?.()
                            }}
                            style={{
                                marginLeft: 'auto', display: 'inline-flex',
                                alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 8,
                                border: '1px solid rgba(99,102,241,0.35)',
                                background: 'rgba(99,102,241,0.1)', color: '#818CF8',
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            Index Repo <Zap size={13} />
                        </button>
                    )}

                    {actionLabel === 'Retry' && (
                        <button type="button" onClick={(e) => {
                            e.stopPropagation()
                            onIndexClick?.()
                        }} style={{
                            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 8,
                            border: '1px solid rgba(239,68,68,0.4)',
                            background: 'transparent', color: '#EF4444',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}>
                            Retry <RefreshCw size={13} />
                        </button>
                    )}

                    {actionLabel === 'Queued' && (
                        <button type="button" disabled style={{
                            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 8,
                            border: '1px solid rgba(161,161,170,0.3)',
                            background: 'rgba(161,161,170,0.08)', color: '#A1A1AA',
                            fontSize: 12, fontWeight: 700, cursor: 'not-allowed', opacity: 0.7,
                        }}>
                            Queued <Clock size={13} />
                        </button>
                    )}
                </div>
            )}
            </div>
        </div>
    )
}