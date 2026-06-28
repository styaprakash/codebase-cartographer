'use client'

import { AVAILABLE_MODELS } from '@/types'
import ModelCard from './ModelCard'

interface Props {
    selectedModel: string
    onSelectModel: (id: string) => void
}

export default function ModelSelectionSection({ selectedModel, onSelectModel }: Props) {
    return (
        <div style={{
            background: 'rgba(17, 17, 24, 0.6)',
            border: '1px solid #1E1E2E',
            borderRadius: '14px',
            padding: '24px',
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Embedding Engine
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 16px 0' }}>
                Choose how your codebase will be vectorized for semantic search.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {AVAILABLE_MODELS.map(m => (
                    <ModelCard
                        key={m.id}
                        model={m}
                        isSelected={selectedModel === m.id}
                        onSelect={onSelectModel}
                    />
                ))}
            </div>
        </div>
    )
}
