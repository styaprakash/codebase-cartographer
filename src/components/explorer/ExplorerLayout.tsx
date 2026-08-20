'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
    MessageSquare,
    Network,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    ArrowLeft,
    ChevronDown,
    Bot,
} from 'lucide-react'
import FileTree from './FileTree'
import ChatPanel from './ChatPanel'
import DependencyMap from './DependencyMap'
import DetailsPanel from './DetailsPanel'
import { repoApi, graphApi } from '@/lib/api'
import { BackendRepo, FileNode, AVAILABLE_MODELS } from '@/types'

interface ExplorerLayoutProps {
    repoId: string
}

export default function ExplorerLayout({ repoId }: ExplorerLayoutProps) {
    const { data: session } = useSession()
    const backendToken = (session as any)?.backendToken as string | undefined

    const [activeTab, setActiveTab] = useState<'ask-ai' | 'dep-map'>('ask-ai')
    const [selectedPath, setSelectedPath] = useState<string | null>(null)
    const [selectedNode, setSelectedNode] = useState<string | null>(null)
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)
    const [llmProvider, setLlmProvider] = useState(AVAILABLE_MODELS[0].id)
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Data fetching
    const [repository, setRepository] = useState<BackendRepo | null>(null)
    const [files, setFiles] = useState<FileNode[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [dataError, setDataError] = useState<string | null>(null)

    useEffect(() => {
        if (!backendToken || !repoId) return

        let isMounted = true
        const fetchData = async () => {
            setIsLoadingData(true)
            setDataError(null)
            try {
                const [repoRes, filesRes] = await Promise.all([
                    repoApi.getById(repoId),
                    graphApi.getFiles(repoId),
                ])
                if (isMounted) {
                    setRepository(repoRes.data)
                    setFiles(filesRes.data ?? [])
                }
            } catch (err) {
                if (isMounted) {
                    setDataError('Failed to load repository data.')
                }
            } finally {
                if (isMounted) {
                    setIsLoadingData(false)
                }
            }
        }
        fetchData()
        return () => { isMounted = false }
    }, [repoId, backendToken])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsModelDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectFile = (path: string) => {
        setSelectedPath(path)
        setSelectedNode(null)
    }

    const handleSelectNode = (nodeId: string) => {
        setSelectedNode(nodeId)
        setSelectedPath(null)
    }

    const handleAskAbout = (moduleName: string) => {
        setActiveTab('ask-ai')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#0A0A0F' }}>
            {/* ── Top Nav Bar ────────────────────────────────────────────────── */}
            <nav style={{ display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid #1E1E2E', backgroundColor: '#0A0A0F', height: '48px', flexShrink: 0, gap: '8px', zIndex: 20 }}>
                {/* Left section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                        onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                        title={isLeftPanelOpen ? 'Hide file explorer' : 'Show file explorer'}
                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', color: isLeftPanelOpen ? '#F1F5F9' : '#64748B', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#111118' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                        {isLeftPanelOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                    </button>
                    <Link
                        href="/dashboard"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#64748B', textDecoration: 'none', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#111118'; e.currentTarget.style.color = '#F1F5F9' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B' }}
                    >
                        <ArrowLeft size={14} />
                        Dashboard
                    </Link>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '20px', backgroundColor: '#1E1E2E', margin: '0 4px' }} />

                {/* Center section — Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
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
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: activeTab === 'ask-ai' ? '2px solid #06B6D4' : '2px solid transparent',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
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
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderBottom: activeTab === 'dep-map' ? '2px solid #06B6D4' : '2px solid transparent',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                    >
                        <Network size={16} />
                        Dependency Map
                    </button>
                </div>

                {/* Right section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* LLM Model Selector */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: '#94A3B8', backgroundColor: 'transparent', border: '1px solid #1E1E2E', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#111118'; e.currentTarget.style.borderColor = '#3E3E4E' }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#1E1E2E' }}
                        >
                            <Bot size={14} />
                            {AVAILABLE_MODELS.find(m => m.id === llmProvider)?.name.split(' ').slice(0, 2).join(' ') ?? 'Model'}
                            <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: isModelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </button>

                        {isModelDropdownOpen && (
                            <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, marginTop: '8px', width: '280px', borderRadius: '12px', border: '1px solid #1E1E2E', backgroundColor: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}>
                                <div style={{ padding: '8px' }}>
                                    <div style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        LLM Provider
                                    </div>
                                    {AVAILABLE_MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => { setLlmProvider(model.id); setIsModelDropdownOpen(false) }}
                                            style={{
                                                display: 'flex',
                                                width: '100%',
                                                alignItems: 'center',
                                                gap: '12px',
                                                borderRadius: '8px',
                                                padding: '10px 12px',
                                                fontSize: '13px',
                                                color: llmProvider === model.id ? '#F1F5F9' : '#94A3B8',
                                                backgroundColor: llmProvider === model.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                textAlign: 'left',
                                            }}
                                            onMouseOver={(e) => { if (llmProvider !== model.id) e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)' }}
                                            onMouseOut={(e) => { if (llmProvider !== model.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                                        >
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: llmProvider === model.id ? '#6366F1' : '#3E3E4E', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{model.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{model.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#1E1E2E' }} />

                    {/* User Avatar */}
                    {session?.user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', border: '1px solid #1E1E2E', overflow: 'hidden', backgroundColor: '#111118', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {session.user.image ? (
                                    <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366F1' }}>
                                        {(session.user.name?.[0] ?? 'U').toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#1E1E2E' }} />

                    {/* Toggle Right Panel */}
                    <button
                        onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                        title={isRightPanelOpen ? 'Hide details' : 'Show details'}
                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', color: isRightPanelOpen ? '#F1F5F9' : '#64748B', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#111118' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                        {isRightPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
                    </button>
                </div>
            </nav>

            {/* ── Body: Panels ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar - File Tree */}
                <div style={{
                    width: isLeftPanelOpen ? '240px' : '0px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'width 0.2s ease',
                    borderRight: isLeftPanelOpen ? '1px solid #1E1E2E' : 'none',
                }}>
                    <FileTree
                        repository={repository}
                        files={files}
                        isLoading={isLoadingData}
                        selectedPath={selectedPath}
                        onSelectFile={handleSelectFile}
                    />
                </div>

                {/* Main Content Area */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0F', position: 'relative', minWidth: 0 }}>
                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        {activeTab === 'ask-ai' && (
                            <ChatPanel
                                repoId={repoId}
                                llmProvider={llmProvider}
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
                <div style={{
                    width: isRightPanelOpen ? '300px' : '0px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'width 0.2s ease',
                    borderLeft: isRightPanelOpen ? '1px solid #1E1E2E' : 'none',
                }}>
                    <DetailsPanel
                        repoId={repoId}
                        selectedPath={selectedPath || selectedNode}
                        isVisible={isRightPanelOpen}
                        onAskAbout={handleAskAbout}
                    />
                </div>
            </div>
        </div>
    )
}
