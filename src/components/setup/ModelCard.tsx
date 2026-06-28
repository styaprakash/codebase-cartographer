'use client'

import type { ModelInfo, BrandTheme } from '@/types'
import { CheckCircle2, Bot, Sparkles } from 'lucide-react'

// ── Brand color map ──────────────────────────────────────────────────────────
// Each brand gets: border, glow (box-shadow), background tint, and active check color.
// To add a new brand, just add an entry here and a lucide icon in the icon map below.
const BRAND_STYLES: Record<BrandTheme, {
    border: string
    glow: string
    bg: string
    check: string
    hoverBorder: string
}> = {
    qwen: {
        border: 'rgba(37, 99, 235, 0.4)',
        glow: '0 0 15px rgba(37, 99, 235, 0.3)',
        bg: 'rgba(37, 99, 235, 0.06)',
        check: '#3B82F6',
        hoverBorder: 'rgba(37, 99, 235, 0.25)',
    },
    gemini: {
        border: 'rgba(168, 85, 247, 0.4)',
        glow: '0 0 15px rgba(168, 85, 247, 0.3)',
        bg: 'rgba(168, 85, 247, 0.06)',
        check: '#A855F7',
        hoverBorder: 'rgba(168, 85, 247, 0.25)',
    },
}

// ── Brand icon map ───────────────────────────────────────────────────────────
// Placeholder icons — swap these for actual SVG logos when available.
const BRAND_ICONS: Record<BrandTheme, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
    qwen: Bot,
    gemini: Sparkles,
}

interface Props {
    model: ModelInfo
    isSelected: boolean
    onSelect: (id: string) => void
}

export default function ModelCard({ model, isSelected, onSelect }: Props) {
    const theme = BRAND_STYLES[model.brandTheme]
    const Icon = BRAND_ICONS[model.brandTheme]

    return (
        <button
            type="button"
            onClick={() => onSelect(model.id)}
            style={{
                width: '100%',
                padding: '20px',
                borderRadius: '14px',
                border: `1px solid ${isSelected ? theme.border : '#1A1A2E'}`,
                background: isSelected ? theme.bg : 'rgba(13, 13, 26, 0.4)',
                boxShadow: isSelected ? theme.glow : 'none',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                textAlign: 'left',
                outline: 'none',
                transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseOver={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = theme.hoverBorder
                    e.currentTarget.style.boxShadow = theme.glow.replace('0.3)', '0.12)')
                }
            }}
            onMouseOut={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.borderColor = '#1A1A2E'
                    e.currentTarget.style.boxShadow = 'none'
                }
            }}
        >
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: theme.check,
                    fontWeight: 500,
                }}>
                    <CheckCircle2 size={14} />
                    Active
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* ── Brand icon — replace <Icon /> with <img src="..." /> for real logos ── */}
                    <Icon
                        size={18}
                        style={{ color: isSelected ? theme.check : '#475569', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 700, color: isSelected ? '#F1F5F9' : '#94A3B8' }}>
                        {model.name}
                    </span>
                </div>
                <p style={{ fontSize: '13px', color: isSelected ? '#94A3B8' : '#64748B', lineHeight: 1.5, margin: 0, paddingLeft: '26px' }}>
                    {model.description}
                </p>
            </div>
        </button>
    )
}
