'use client'

import { Search } from 'lucide-react'

interface RepoSearchProps {
    value: string
    onChange: (value: string) => void
}

export default function RepoSearch({ value, onChange }: RepoSearchProps) {
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Search
                size={16}
                color="#64748B"
                style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search repositories..."
                style={{
                    width: '100%',
                    paddingLeft: 44,
                    paddingRight: 16,
                    paddingTop: 12,
                    paddingBottom: 12,
                    background: '#0D0D1A',
                    border: '1px solid #1E1E2E',
                    borderRadius: 12,
                    color: '#F1F5F9',
                    fontSize: 14,
                    outline: 'none',
                }}
            />
        </div>
    )
}