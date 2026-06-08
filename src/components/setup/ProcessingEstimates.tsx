'use client'

import { Clock, Cpu, FileText, Layers } from 'lucide-react'

interface Props {
    totalFiles?: number
    modelName?: string
}

export default function ProcessingEstimates({ totalFiles, modelName = 'Qwen3 Embedding' }: Props) {
    return (
        <div style={{
            background: 'rgba(17, 17, 24, 0.6)',
            border: '1px solid #1E1E2E',
            borderRadius: '14px',
            padding: '24px',
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', margin: 0 }}>
                What Happens During Indexing
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', margin: '-8px 0 16px 0' }}>
                Processing metrics will be available once indexing begins.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                    <Cpu size={16} color="#818CF8" />
                    <div>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Model</p>
                        <p style={{ fontSize: '13px', color: '#F1F5F9', fontWeight: 500, margin: 0 }}>{modelName}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                    <FileText size={16} color="#818CF8" />
                    <div>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Files</p>
                        <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 400, margin: 0 }}>
                            {totalFiles ? `${totalFiles} files` : 'Detecting...'}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                    <Layers size={16} color="#818CF8" />
                    <div>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Processing</p>
                        <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 400, margin: 0 }}>
                            Calculated during indexing
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: '#111118' }}>
                    <Clock size={16} color="#818CF8" />
                    <div>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Est. Time</p>
                        <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 400, margin: 0 }}>
                            Available after indexing starts
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
