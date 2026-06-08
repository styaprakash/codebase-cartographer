'use client'

export type FilterTab = 'all' | 'indexed' | 'indexing' | 'failed'

interface Props {
    active: FilterTab
    counts: { all: number; indexed: number; indexing: number; failed: number }
    onChange: (tab: FilterTab) => void
}

const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'indexed', label: 'Indexed' },
    { key: 'indexing', label: 'Indexing' },
    { key: 'failed', label: 'Failed' },
]

export default function DashboardFilterTabs({ active, counts, onChange }: Props) {
    return (
        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#0D0D1A', borderRadius: '12px', border: '1px solid #1E1E2E' }}>
            {TABS.map(({ key, label }) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    style={{
                        flex: 1,
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: active === key ? '#1E1E2E' : 'transparent',
                        color: active === key ? '#F1F5F9' : '#64748B',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                    }}
                >
                    {label}
                    <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        background: active === key ? '#2D2D3F' : '#111118',
                        color: active === key ? '#94A3B8' : '#64748B',
                    }}>
                        {counts[key]}
                    </span>
                </button>
            ))}
        </div>
    )
}
