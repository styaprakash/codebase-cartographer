'use client'

import type { ModelInfo } from '@/types'
import { CheckCircle2, Clock } from 'lucide-react'

interface Props {
    model: ModelInfo
    isPrimary?: boolean
}

export default function ModelCard({ model, isPrimary = false }: Props) {
    const isActive = model.available

    return (
        <div style={{
            width: '100%',
            padding: '20px',
            borderRadius: '14px',
            border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.3)' : '#1A1A2E'}`,
            background: isActive ? 'rgba(99, 102, 241, 0.06)' : 'rgba(13, 13, 26, 0.4)',
            opacity: isActive ? 1 : 0.5,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {isActive && isPrimary && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#10B981',
                    fontWeight: 500,
                }}>
                    <CheckCircle2 size={14} />
                    Active
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: isActive ? '#F1F5F9' : '#475569' }}>
                        {model.name}
                    </span>
                    {model.badge && isActive && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818CF8',
                        }}>
                            {model.badge}
                        </span>
                    )}
                    {!isActive && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#F59E0B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>
                            <Clock size={10} />
                            Coming Soon
                        </span>
                    )}
                </div>
                <p style={{ fontSize: '13px', color: isActive ? '#94A3B8' : '#475569', lineHeight: 1.5, margin: 0 }}>
                    {model.description}
                </p>
            </div>
        </div>
    )
}
