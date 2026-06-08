'use client'

import { ArrowDown, Code, Database, FileSearch, Sparkles, Workflow } from 'lucide-react'

const STEPS = [
    { icon: Code, label: 'Fetch Repository', desc: 'Clone or fetch the file tree from GitHub' },
    { icon: FileSearch, label: 'Chunk Code', desc: 'Split files into smaller, searchable segments' },
    { icon: Sparkles, label: 'Generate Embeddings', desc: 'Convert each chunk into a vector' },
    { icon: Database, label: 'Store Vectors', desc: 'Save vectors in pgvector for similarity search' },
    { icon: Workflow, label: 'Ask Questions', desc: 'Query your codebase with natural language' },
]

export default function PipelineVisualization() {
    return (
        <div style={{
            background: 'rgba(17, 17, 24, 0.6)',
            border: '1px solid #1E1E2E',
            borderRadius: '14px',
            padding: '24px',
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px', margin: 0 }}>
                AI Pipeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {STEPS.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Icon size={16} color="#818CF8" />
                                </div>
                                {i < STEPS.length - 1 && (
                                    <ArrowDown size={14} color="#2D2D3F" />
                                )}
                            </div>
                            <div style={{ paddingTop: '6px' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9', margin: 0 }}>{step.label}</p>
                                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>{step.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
