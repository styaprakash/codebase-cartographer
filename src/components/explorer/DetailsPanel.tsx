'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal, ArrowLeft, Folder, Code2, ArrowRight } from 'lucide-react'
import { ModuleDetails } from '@/types'

// Mock fetching details based on path/id
// In a real app, this would be an API call via a hook like useModuleDetails
const fetchModuleDetails = async (pathOrId: string): Promise<ModuleDetails> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: pathOrId.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Module',
                filePath: pathOrId.includes('/') ? pathOrId : `src/services/${pathOrId}`,
                description: 'Core orchestration service that manages the parallel indexing of codebases via AST parsing and vector embeddings.',
                functions: ['initializeWorkers()', 'processRepo()', 'generateEmbeddings()'],
                incoming: ['App.tsx'],
                outgoing: ['ASTParser.ts', 'VectorDB.ts']
            })
        }, 500)
    })
}

interface DetailsPanelProps {
    repoId: string
    selectedPath: string | null
    onAskAbout: (moduleName: string) => void
}

export default function DetailsPanel({ repoId, selectedPath, onAskAbout }: DetailsPanelProps) {
    const [details, setDetails] = useState<ModuleDetails | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!selectedPath) {
            setDetails(null)
            return
        }

        let isMounted = true
        setIsLoading(true)
        
        fetchModuleDetails(selectedPath).then((data) => {
            if (isMounted) {
                setDetails(data)
                setIsLoading(false)
            }
        })

        return () => {
            isMounted = false
        }
    }, [selectedPath])

    return (
        <aside style={{ width: '300px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1E1E2E', backgroundColor: '#0A0A0F', zIndex: 10 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: 0 }}>Details</h2>
                <MoreHorizontal size={16} color="#64748B" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F1F5F9'} onMouseOut={(e) => e.currentTarget.style.color = '#64748B'} />
            </div>

            <div id="details-content" className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                
                {!selectedPath ? (
                    <div id="details-empty" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
                        <ArrowLeft size={32} style={{ color: 'rgba(99, 102, 241, 0.2)', marginBottom: '16px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                        <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                            Click any file or graph node to see its details here.
                        </p>
                    </div>
                ) : isLoading ? (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div className="cc-skeleton" style={{ height: '24px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '75%' }}></div>
                            <div className="cc-skeleton" style={{ height: '12px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '50%' }}></div>
                        </div>
                        <div className="cc-skeleton" style={{ height: '80px', backgroundColor: '#1E1E2E', borderRadius: '8px', width: '100%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="cc-skeleton" style={{ height: '12px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '33%' }}></div>
                            <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '100%' }}></div>
                            <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '83%' }}></div>
                        </div>
                    </div>
                ) : details ? (
                    <div id="details-active" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px', marginTop: 0 }}>{details.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#64748B' }}>
                                <Folder size={12} /> {details.filePath}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <p style={{ fontSize: '12px', color: '#F1F5F9', lineHeight: 1.6, margin: 0 }}>
                                    {details.description}
                                </p>
                            </div>
                        </div>

                        {details.functions.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h4 style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748B', letterSpacing: '0.1em', margin: 0 }}>Key Functions</h4>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {details.functions.map((func, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F1F5F9' }}>
                                            <Code2 size={14} color="#818CF8" /> {func}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                            {details.incoming.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h4 style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748B', letterSpacing: '0.1em', margin: 0 }}>Incoming</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {details.incoming.map((inc, i) => (
                                            <div key={i} style={{ fontSize: '12px', color: '#F1F5F9', backgroundColor: '#111118', padding: '8px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={inc}>
                                                {inc}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {details.outgoing.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h4 style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#64748B', letterSpacing: '0.1em', margin: 0 }}>Outgoing</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {details.outgoing.map((out, i) => (
                                            <div key={i} style={{ fontSize: '12px', color: '#F1F5F9', backgroundColor: '#111118', padding: '8px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={out}>
                                                {out}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => onAskAbout(`Tell me about ${details.name}`)}
                            style={{ width: '100%', padding: '12px', marginTop: '16px', backgroundColor: '#4F46E5', color: '#ffffff', fontSize: '12px', fontWeight: 600, borderRadius: '12px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1)', cursor: 'pointer', border: 'none' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#6366F1'; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.transform = 'translateX(4px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.transform = 'translateX(0)'; }}
                        >
                            Ask AI about this module 
                            <ArrowRight size={14} style={{ transition: 'transform 0.2s' }} />
                        </button>
                    </div>
                ) : null}
            </div>
        </aside>
    )
}
