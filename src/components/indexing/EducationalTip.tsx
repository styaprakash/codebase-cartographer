'use client'

import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'

const TIPS = [
    'Embeddings convert source code into vectors that can be searched semantically. Similar functions cluster together in high-dimensional space.',
    'pgvector enables similarity search directly inside PostgreSQL — your code is stored as vectors alongside metadata.',
    'Chunking improves retrieval precision by splitting files into smaller, focused segments instead of searching entire files.',
    'NV-Embed-v2 is optimized for high-quality retrieval, making it ideal for complex codebases with deep dependency chains.',
    'Qwen3 Embedding balances speed and accuracy — perfect for everyday code search and understanding.',
]

export default function EducationalTip() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % TIPS.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            background: 'rgba(17, 17, 24, 0.8)',
            border: '1px solid #1E1E2E',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            transition: 'opacity 0.3s ease',
        }}>
            <div style={{
                padding: '6px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Lightbulb size={18} color="#F59E0B" />
            </div>
            <div>
                <p style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600, marginBottom: '4px', margin: 0 }}>
                    Did You Know?
                </p>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', margin: 0 }}>
                    {TIPS[index]}
                </p>
            </div>
        </div>
    )
}
