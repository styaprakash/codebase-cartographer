'use client'

import { AVAILABLE_MODELS } from '@/types'
import ModelCard from './ModelCard'

/**
 * ModelInformation — informational display of available embedding engines.
 *
 * Currently shows the active engine (Qwen3) and upcoming models as info cards.
 * No selection, no configuration.
 *
 * Future: Replace with <ModelSelector /> when multi-model support is ready.
 * The wrapping section layout and structure should remain compatible.
 */

export default function ModelInformation() {
    const activeModel = AVAILABLE_MODELS.find(m => m.available)
    const upcomingModels = AVAILABLE_MODELS.filter(m => !m.available)

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
                Your codebase will be processed using the Qwen3 Embedding model running locally through Ollama.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeModel && <ModelCard model={activeModel} isPrimary />}
                {upcomingModels.length > 0 && (
                    <>
                        <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 0 0', fontWeight: 500 }}>
                            Additional models coming soon
                        </p>
                        {upcomingModels.map(m => (
                            <ModelCard key={m.id} model={m} />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
