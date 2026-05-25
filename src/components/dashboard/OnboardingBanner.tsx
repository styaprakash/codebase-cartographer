'use client'

import { Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cc-dashboard-helper-dismissed'

export default function OnboardingBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(localStorage.getItem(STORAGE_KEY) !== '1')
    }, [])

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div 
            id="helper-banner" 
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Sparkles style={{ color: '#6366F1', width: '16px', height: '16px' }} />
                </div>
                <p style={{ fontSize: '14px', color: '#F1F5F9', margin: 0 }}>
                    <span style={{ fontWeight: 600, color: '#6366F1' }}>✨ Welcome!</span>{' '}
                    Select a repo to index it. Once indexed, you can ask the AI questions about it.
                </p>
            </div>
            <button
                type="button"
                onClick={dismiss}
                style={{
                    color: '#64748B',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F1F5F9'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748B'
                    e.currentTarget.style.background = 'transparent'
                }}
                aria-label="Dismiss"
            >
                <X style={{ width: '16px', height: '16px' }} />
            </button>
        </div>
    )
}