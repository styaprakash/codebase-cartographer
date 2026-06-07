'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Folder, FileCode, RefreshCw, Box } from 'lucide-react'
import { useFileTree } from '@/hooks/useFileTree'
import { FileNode } from '@/types'
import { useRouter } from 'next/navigation'

interface FileTreeProps {
    repoId: string
    selectedPath: string | null
    onSelectFile: (path: string) => void
}

export default function FileTree({ repoId, selectedPath, onSelectFile }: FileTreeProps) {
    const { files, isLoading, error } = useFileTree(repoId)
    const router = useRouter()
    
    const handleReindex = () => {
        router.push(`/indexing/${repoId}`)
    }

    return (
        <aside style={{ width: '240px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1E1E2E', backgroundColor: '#0A0A0F', zIndex: 10 }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #1E1E2E' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'linear-gradient(to bottom right, #6366F1, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box size={14} color="#ffffff" />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '-0.025em', color: '#F1F5F9' }}>Repository</span>
                </div>
                <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '4px', fontSize: '12px', color: '#64748B' }}>
                    <span>main</span>
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Tree Body */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {isLoading ? (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '75%' }}></div>
                        <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '50%', marginLeft: '16px' }}></div>
                        <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '66%', marginLeft: '16px' }}></div>
                        <div className="cc-skeleton" style={{ height: '16px', backgroundColor: '#1E1E2E', borderRadius: '4px', width: '83%' }}></div>
                    </div>
                ) : error ? (
                    <div style={{ padding: '16px', fontSize: '12px', color: '#F87171' }}>
                        Failed to load file tree.
                    </div>
                ) : files.length === 0 ? (
                    <div style={{ padding: '16px', fontSize: '12px', color: '#64748B' }}>
                        No files found.
                    </div>
                ) : (
                    <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                        {files.map((node, i) => (
                            <TreeNode 
                                key={i} 
                                node={node} 
                                selectedPath={selectedPath} 
                                onSelect={onSelectFile} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px', borderTop: '1px solid #1E1E2E' }}>
                <button 
                    onClick={handleReindex}
                    style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#F1F5F9'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
                >
                    <RefreshCw size={12} />
                    Re-index repository
                </button>
            </div>
        </aside>
    )
}

function TreeNode({ 
    node, 
    selectedPath, 
    onSelect, 
    depth = 0 
}: { 
    node: FileNode
    selectedPath: string | null
    onSelect: (path: string) => void
    depth?: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const isSelected = selectedPath === node.path
    
    const isDir = node.type === 'directory' || !!node.children

    if (isDir) {
        return (
            <div>
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: `6px 8px 6px ${depth * 12 + 8}px`, color: '#64748B', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111118'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronRight size={14} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }} />
                    <Folder size={14} color="#6366F1" />
                    <span>{node.name}</span>
                </div>
                {isOpen && node.children && (
                    <div>
                        {node.children.map((child, i) => (
                            <TreeNode 
                                key={i} 
                                node={child} 
                                selectedPath={selectedPath} 
                                onSelect={onSelect} 
                                depth={depth + 1} 
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: `6px 8px 6px ${depth * 12 + (isSelected ? 6 : 8)}px`, 
                borderRadius: '4px', 
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isSelected ? '#818CF8' : '#64748B',
                borderLeft: isSelected ? '2px solid #6366F1' : '2px solid transparent',
                transition: 'background-color 0.2s, color 0.2s'
            }}
            onMouseOver={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#111118';
                    const dot = e.currentTarget.querySelector('.file-dot') as HTMLElement;
                    if (dot) dot.style.backgroundColor = '#64748B';
                }
            }}
            onMouseOut={(e) => {
                if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    const dot = e.currentTarget.querySelector('.file-dot') as HTMLElement;
                    if (dot) dot.style.backgroundColor = '#1E1E2E';
                }
            }}
            onClick={() => onSelect(node.path)}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={14} />
                <span>{node.name}</span>
            </div>
            <div 
                className="file-dot"
                style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: isSelected ? '#6366F1' : '#1E1E2E',
                    transition: 'background-color 0.2s' 
                }}
            ></div>
        </div>
    )
}
