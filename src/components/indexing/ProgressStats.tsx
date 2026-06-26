'use client'

import React from 'react'

interface Props {
    indexedFiles: number
    totalFiles: number
    isDone: boolean
    isFailed?: boolean
    progress: number
}

function ProgressStats({ indexedFiles, totalFiles, isDone, isFailed, progress }: Props) {
    const pct = totalFiles > 0 ? Math.round((indexedFiles / totalFiles) * 100) : 0;
    const boundedPct = Math.min(100, Math.max(0, pct));

    // If it failed, we completely hide this bar as requested (handled by parent returning FailedView, but if rendered, return null)
    if (isFailed) return null;

    return (
        <div style={{ width: '100%' }}>
            <div style={{
                width: '100%',
                height: '8px',
                background: '#1A1A2E',
                borderRadius: '99px',
                overflow: 'hidden',
                marginBottom: '12px',
                position: 'relative',
            }}>
                <div style={{
                    width: isDone ? '100%' : `${boundedPct}%`,
                    height: '100%',
                    borderRadius: '99px',
                    background: isDone ? '#10B981' : 'linear-gradient(90deg, #6366F1, #06B6D4)',
                    transition: 'width 0.5s ease',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                }}>
                    {!isDone && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '32px',
                            height: '32px',
                            background: '#06B6D4',
                            filter: 'blur(16px)',
                            opacity: 0.5,
                        }} />
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                    {indexedFiles} / {totalFiles} files processed
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isDone ? '#10B981' : '#06B6D4' }}>
                    {isDone ? '100%' : `${boundedPct}%`}
                </span>
            </div>
        </div>
    )
}

export default React.memo(ProgressStats)
