'use client'

import React, { useEffect, useRef, useState } from 'react'

interface FileEntry {
    id: number
    path: string
    completed: boolean
}

interface Props {
    completedFiles: string[]
    currentFile: string | null
}

function LiveFileFeed({ completedFiles, currentFile }: Props) {
    const [entries, setEntries] = useState<FileEntry[]>([])
    const seenFiles = useRef(new Set<string>())
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const newFiles = completedFiles.filter(
            f => !seenFiles.current.has(f),
        )
        if (newFiles.length === 0) return

        for (const file of newFiles) {
            seenFiles.current.add(file)
        }

        setEntries(prev => {
            const next = [
                ...newFiles.map((path, i) => ({
                    id: Date.now() + i,
                    path,
                    completed: true,
                })),
                ...prev,
            ]
            return next.slice(0, 40)
        })
    }, [completedFiles])

    useEffect(() => {
        if (!currentFile || seenFiles.current.has(currentFile)) return

        setEntries(prev => {
            if (prev.some(e => e.path === currentFile)) return prev
            return [
                { id: Date.now(), path: currentFile, completed: false },
                ...prev,
            ].slice(0, 40)
        })
    }, [currentFile])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop =
                containerRef.current.scrollHeight
        }
    }, [entries])

    if (entries.length === 0) {
        return (
            <div
                style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#475569',
                    fontSize: '13px',
                }}
            >
                Waiting for files...
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '4px',
            }}
        >
            {entries.map((entry, index) => (
                <div
                    key={`${entry.id}-${index}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: entry.completed
                            ? 'rgba(16, 185, 129, 0.04)'
                            : 'transparent',
                        border: `1px solid ${
                            entry.completed
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'transparent'
                        }`,
                        animation: entry.completed
                            ? undefined
                            : 'fadeInUp 0.4s ease-out',
                    }}
                >
                    <div
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: entry.completed
                                ? '#10B981'
                                : '#6366F1',
                            flexShrink: 0,
                        }}
                    />

                    <span
                        style={{
                            fontSize: '12px',
                            fontFamily: 'var(--font-geist-mono), monospace',
                            color: entry.completed
                                ? '#94A3B8'
                                : '#F1F5F9',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {entry.path}
                    </span>

                    {!entry.completed && (
                        <span
                            style={{
                                fontSize: '11px',
                                color: '#818CF8',
                                animation:
                                    'pulse 1.5s ease-in-out infinite',
                            }}
                        >
                            Processing...
                        </span>
                    )}
                </div>
            ))}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default React.memo(LiveFileFeed)
