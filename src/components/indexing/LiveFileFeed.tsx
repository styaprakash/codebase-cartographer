'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Processing Activity Preview — temporary UX simulation.
 *
 * This component renders a visual preview of file processing activity.
 * It is designed to be replaced with real-time SSE/WebSocket streaming
 * in a future release. The data shown here is simulated on the frontend
 * and does not represent actual backend events.
 */

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.rb', '.vue', '.css', '.scss', '.json', '.yaml', '.md']
const DIRS = ['src', 'src/components', 'src/lib', 'src/hooks', 'src/app', 'src/utils', 'src/types', 'src/services', 'tests', 'config', 'scripts', 'lib', 'api']

interface FileEntry {
    id: number
    path: string
    chars: number
    chunks: number
    progress: number
}

function generateFakeFile(index: number): FileEntry {
    const dir = DIRS[index % DIRS.length]
    const ext = EXTENSIONS[index % EXTENSIONS.length]
    const name = `file-${index}${ext}`
    const chars = Math.floor(Math.random() * 3000) + 200
    const chunks = Math.max(1, Math.floor(chars / 512))
    return {
        id: index,
        path: `${dir}/${name}`,
        chars,
        chunks,
        progress: 0,
    }
}

interface Props {
    indexedFiles: number
    totalFiles: number
}

export default function LiveFileFeed({ indexedFiles, totalFiles }: Props) {
    const [entries, setEntries] = useState<FileEntry[]>([])
    const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())
    const containerRef = useRef<HTMLDivElement>(null)
    const nextId = useRef(0)

    useEffect(() => {
        const targetCount = Math.max(0, indexedFiles)
        const simulated = Math.min(targetCount, totalFiles || 100)

        while (nextId.current < Math.min(simulated, 50)) {
            const entry = generateFakeFile(nextId.current)
            nextId.current += 1
            setEntries(prev => [...prev.slice(-40), entry])

            const id = nextId.current - 1
            setTimeout(() => {
                setCompletedIds(prev => new Set(prev).add(id))
            }, Math.random() * 2000 + 500)
        }
    }, [indexedFiles, totalFiles])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [entries])

    if (entries.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                Waiting for files...
            </div>
        )
    }

    return (
        <div ref={containerRef} style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: '4px',
        }}>
            {entries.map((entry) => {
                const done = completedIds.has(entry.id)
                return (
                    <div
                        key={entry.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: done ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                            border: `1px solid ${done ? 'rgba(16, 185, 129, 0.1)' : 'transparent'}`,
                            animation: done ? undefined : 'fadeInUp 0.4s ease-out',
                        }}
                    >
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: done ? '#10B981' : '#6366F1',
                            flexShrink: 0,
                        }} />

                        <span style={{
                            fontSize: '12px',
                            fontFamily: 'var(--font-geist-mono), monospace',
                            color: done ? '#94A3B8' : '#F1F5F9',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {entry.path}
                        </span>

                        <span style={{
                            fontSize: '11px',
                            color: '#64748B',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}>
                            {entry.chars.toLocaleString()} chars · {entry.chunks} chunks
                        </span>

                        <div style={{
                            width: '48px',
                            height: '4px',
                            borderRadius: '99px',
                            background: '#1E1E2E',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                width: done ? '100%' : '60%',
                                height: '100%',
                                borderRadius: '99px',
                                background: done ? '#10B981' : 'linear-gradient(90deg, #6366F1, #06B6D4)',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                    </div>
                )
            })}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
