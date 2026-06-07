'use client'

import { useState } from 'react'
import { MessageSquare, Network } from 'lucide-react'
import FileTree from './FileTree'
import ChatPanel from './ChatPanel'
import DependencyMap from './DependencyMap'
import DetailsPanel from './DetailsPanel'

interface ExplorerLayoutProps {
    repoId: string
}

export default function ExplorerLayout({ repoId }: ExplorerLayoutProps) {
    const [activeTab, setActiveTab] = useState<'ask-ai' | 'dep-map'>('ask-ai')
    const [selectedPath, setSelectedPath] = useState<string | null>(null)
    const [selectedNode, setSelectedNode] = useState<string | null>(null)

    const handleSelectFile = (path: string) => {
        setSelectedPath(path)
        setSelectedNode(null) // Clear graph node selection
    }

    const handleSelectNode = (nodeId: string) => {
        setSelectedNode(nodeId)
        setSelectedPath(null) // Clear file tree selection
    }

    const handleAskAbout = (moduleName: string) => {
        setActiveTab('ask-ai')
        // In a more complex app, we might pass an initial query to the ChatPanel via state
        // For now, switching tabs is sufficient. The ChatPanel could read this from a context.
    }

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#0A0A0F' }}>
            {/* Left Sidebar - File Tree */}
            <FileTree 
                repoId={repoId} 
                selectedPath={selectedPath} 
                onSelectFile={handleSelectFile} 
            />

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0F', position: 'relative' }}>
                {/* Tab Bar */}
                <nav style={{ display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #1E1E2E', backgroundColor: '#0A0A0F', height: '48px', gap: '24px' }}>
                    <button 
                        onClick={() => setActiveTab('ask-ai')}
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 500,
                            padding: '0 8px',
                            transition: 'all 0.2s ease',
                            color: activeTab === 'ask-ai' ? '#06B6D4' : '#64748B',
                            borderBottom: activeTab === 'ask-ai' ? '2px solid #06B6D4' : '2px solid transparent',
                        }}
                    >
                        <MessageSquare size={16} />
                        Ask AI
                    </button>
                    <button 
                        onClick={() => setActiveTab('dep-map')}
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 500,
                            padding: '0 8px',
                            transition: 'all 0.2s ease',
                            color: activeTab === 'dep-map' ? '#06B6D4' : '#64748B',
                            borderBottom: activeTab === 'dep-map' ? '2px solid #06B6D4' : '2px solid transparent',
                        }}
                    >
                        <Network size={16} />
                        Dependency Map
                    </button>
                </nav>

                {/* Tab Content */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    {activeTab === 'ask-ai' && (
                        <ChatPanel 
                            repoId={repoId} 
                            onFileReference={handleSelectFile} 
                        />
                    )}
                    {activeTab === 'dep-map' && (
                        <DependencyMap 
                            repoId={repoId} 
                            selectedNodeId={selectedNode} 
                            onSelectNode={handleSelectNode} 
                        />
                    )}
                </div>
            </main>

            {/* Right Panel - Details */}
            <DetailsPanel 
                repoId={repoId} 
                selectedPath={selectedPath || selectedNode} 
                onAskAbout={handleAskAbout} 
            />
        </div>
    )
}
