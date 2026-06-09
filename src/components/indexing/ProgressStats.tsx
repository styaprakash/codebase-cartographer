'use client'

import React from 'react'

interface Props {
    indexedFiles: number
    totalFiles: number
    estimatedChunks: number
    isDone: boolean
    progress: number
}

function ProgressStats({ indexedFiles, totalFiles, estimatedChunks, isDone, progress }: Props) {
    return (
        <div style={{ width: '100%' }}>
            <div style={{
                width: '100%',
                height: '8px',
                background: '#1A1A2E',
                borderRadius: '99px',
                overflow: 'hidden',
                marginBottom: '12px',
            }}>
                <div style={{
                    width: `${isDone ? 100 : progress}%`,
                    height: '100%',
                    borderRadius: '99px',
                    background: isDone ? '#10B981' : 'linear-gradient(90deg, #6366F1, #06B6D4)',
                    transition: 'width 0.5s ease',
                    position: 'relative',
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
                    {indexedFiles} / {totalFiles} files · {estimatedChunks.toLocaleString()} chunks
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isDone ? '#10B981' : '#06B6D4' }}>
                    {isDone ? '100%' : `${progress}%`}
                </span>
            </div>
        </div>
    )
}

export default React.memo(ProgressStats)
