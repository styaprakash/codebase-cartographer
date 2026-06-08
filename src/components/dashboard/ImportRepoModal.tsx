'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { GitBranch, Search, X } from 'lucide-react'
import type { GithubRepo } from '@/types'

interface Props {
    repos: GithubRepo[]
    onImport: (repo: GithubRepo) => void
    onClose: () => void
}

export default function ImportRepoModal({ repos, onImport, onClose }: Props) {
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return repos
        return repos.filter(
            r =>
                r.name.toLowerCase().includes(q) ||
                (r.description ?? '').toLowerCase().includes(q) ||
                (r.language ?? '').toLowerCase().includes(q),
        )
    }, [repos, query])

    const selected = repos.find(r => r.id === selectedId)

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div style={{
                width: '100%',
                maxWidth: '640px',
                maxHeight: '80vh',
                background: '#111124',
                border: '1px solid #1E1E2E',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 0 60px rgba(0, 0, 0, 0.6)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #1E1E2E',
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
                        Import Repository
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '8px',
                            display: 'flex',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E1E2E' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="#64748B" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search repositories..."
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 40px',
                                borderRadius: '10px',
                                border: '1px solid #1E1E2E',
                                background: '#0D0D1A',
                                color: '#F1F5F9',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Repo List */}
                <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                            <p style={{ color: '#64748B', fontSize: '14px' }}>No repositories match your search.</p>
                        </div>
                    ) : (
                        filtered.map((repo) => (
                            <button
                                key={repo.id}
                                type="button"
                                onClick={() => setSelectedId(repo.id)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: `1px solid ${selectedId === repo.id ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}`,
                                    background: selectedId === repo.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                    cursor: 'pointer',
                                    marginBottom: '4px',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <svg viewBox="0 0 24 24" fill="#818CF8" width="20" height="20">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9' }}>{repo.name}</span>
                                        <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <GitBranch size={11} />
                                            {repo.default_branch}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {repo.description || 'No description'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        {repo.language && (
                                            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{repo.language}</span>
                                        )}
                                        <span style={{ fontSize: '11px', color: '#475569' }}>
                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    padding: '16px 24px',
                    borderTop: '1px solid #1E1E2E',
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            border: '1px solid #1E1E2E',
                            background: 'transparent',
                            color: '#94A3B8',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!selected}
                        onClick={() => selected && onImport(selected)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: selected ? 'linear-gradient(135deg, #6366F1, #4F46E5)' : '#1E1E2E',
                            color: selected ? 'white' : '#475569',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: selected ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
