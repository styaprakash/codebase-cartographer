'use client'

import React from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

export interface TimelinePhase {
    label: string
    done: boolean
    active: boolean
}

interface Props {
    phases: TimelinePhase[]
}

function ProgressTimeline({ phases }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {phases.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {p.done ? (
                        <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0 }} />
                    ) : p.active ? (
                        <Loader2 size={18} color="#818CF8" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '2px solid #2D2D3F',
                            flexShrink: 0,
                        }} />
                    )}
                    <span style={{
                        fontSize: '14px',
                        fontWeight: p.done ? 500 : p.active ? 500 : 400,
                        color: p.done ? '#F1F5F9' : p.active ? '#F1F5F9' : '#475569',
                        transition: 'color 0.3s ease',
                    }}>
                        {p.label}
                    </span>
                    {p.active && (
                        <span style={{
                            fontSize: '11px',
                            color: '#818CF8',
                            fontWeight: 500,
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}>
                            In progress...
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}

export default React.memo(ProgressTimeline)
