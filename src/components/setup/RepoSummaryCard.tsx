'use client'

import { Database, GitBranch, Globe, User } from 'lucide-react'

interface Props {
    name: string
    owner: string
    language: string
    branch: string
}

export default function RepoSummaryCard({ name, owner, language, branch }: Props) {
    return (
        <div style={{
            background: 'rgba(17, 17, 24, 0.6)',
            border: '1px solid #1E1E2E',
            borderRadius: '14px',
            padding: '24px',
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', margin: 0 }}>
                Repository Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database size={16} color="#64748B" />
                    <span style={{ fontSize: '14px', color: '#F1F5F9', fontWeight: 500 }}>{name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={16} color="#64748B" />
                    <span style={{ fontSize: '14px', color: '#94A3B8' }}>{owner}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={16} color="#64748B" />
                    <span style={{ fontSize: '14px', color: '#94A3B8' }}>{language || 'Unknown'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <GitBranch size={16} color="#64748B" />
                    <span style={{ fontSize: '14px', color: '#94A3B8' }}>{branch}</span>
                </div>
            </div>
        </div>
    )
}
