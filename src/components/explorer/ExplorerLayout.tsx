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
import { buildFileTree } from '@/hooks/useFileTree'

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
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Resizable sidebar states
    const [sidebarWidth, setSidebarWidth] = useState(240)
    const [isDragging, setIsDragging] = useState(false)
    const [rightSidebarWidth, setRightSidebarWidth] = useState(300)
    const [isRightDragging, setIsRightDragging] = useState(false)
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

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
                    const rawPaths: string[] = filesRes.data ?? []
                    setFiles(buildFileTree(rawPaths))
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

    const handleAskAbout = (query: string) => {
        setPendingPrompt(query)
        setActiveTab('ask-ai')
    }

    // Resizable left sidebar logic
    const handleLeftPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isLeftPanelOpen) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setIsDragging(true)
        e.preventDefault() // prevent text selection
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
    }

    const handleLeftPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const maxWidth = Math.min(600, window.innerWidth * 0.5)
        let newWidth = e.clientX
        if (newWidth < 160) newWidth = 160
        if (newWidth > maxWidth) newWidth = maxWidth
        setSidebarWidth(newWidth)
    }

    const handleLeftPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return
        e.currentTarget.releasePointerCapture(e.pointerId)
        setIsDragging(false)
        document.body.style.cursor = 'default'
        document.body.style.userSelect = 'auto'
    }

    // Resizable right sidebar logic
    const handleRightPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isRightPanelOpen) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setIsRightDragging(true)
        e.preventDefault()
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
    }

    const handleRightPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isRightDragging) return
        const maxWidth = Math.min(600, window.innerWidth * 0.5)
        let newWidth = window.innerWidth - e.clientX
        if (newWidth < 200) newWidth = 200 // minimum width for details panel
        if (newWidth > maxWidth) newWidth = maxWidth
        setRightSidebarWidth(newWidth)
    }

    const handleRightPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isRightDragging) return
        e.currentTarget.releasePointerCapture(e.pointerId)
        setIsRightDragging(false)
        document.body.style.cursor = 'default'
        document.body.style.userSelect = 'auto'
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
                    position: 'relative',
                    width: isLeftPanelOpen ? `${sidebarWidth}px` : '0px',
                    flexShrink: 0,
                    transition: isDragging ? 'none' : 'width 0.2s ease',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
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
                    {/* Splitter */}
                    {isLeftPanelOpen && (
                        <div
                            onPointerDown={handleLeftPointerDown}
                            onPointerMove={handleLeftPointerMove}
                            onPointerUp={handleLeftPointerUp}
                            onPointerCancel={handleLeftPointerUp}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: '-4px', // shift half the width to center over border
                                width: '8px',
                                height: '100%',
                                cursor: 'col-resize',
                                zIndex: 30,
                            }}
                            onMouseEnter={(e) => {
                                const divider = e.currentTarget.children[0] as HTMLElement;
                                if (divider && !isDragging) divider.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                const divider = e.currentTarget.children[0] as HTMLElement;
                                if (divider && !isDragging) divider.style.opacity = '0';
                            }}
                        >
                            <div style={{
                                width: '1px',
                                height: '100%',
                                backgroundColor: '#6366F1',
                                opacity: isDragging ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                margin: '0 auto',
                            }} />
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0A0A0F', position: 'relative', minWidth: 0 }}>
                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        {activeTab === 'ask-ai' && (
                            <ChatPanel
                                repoId={repoId}
                                onFileReference={handleSelectFile}
                                initialQuery={pendingPrompt}
                                onClearInitialQuery={() => setPendingPrompt(null)}
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
                    position: 'relative',
                    width: isRightPanelOpen ? `${rightSidebarWidth}px` : '0px',
                    flexShrink: 0,
                    transition: isRightDragging ? 'none' : 'width 0.2s ease',
                }}>
                    {/* Splitter */}
                    {isRightPanelOpen && (
                        <div
                            onPointerDown={handleRightPointerDown}
                            onPointerMove={handleRightPointerMove}
                            onPointerUp={handleRightPointerUp}
                            onPointerCancel={handleRightPointerUp}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '-4px', // shift half the width to center over border
                                width: '8px',
                                height: '100%',
                                cursor: 'col-resize',
                                zIndex: 30,
                            }}
                            onMouseEnter={(e) => {
                                const divider = e.currentTarget.children[0] as HTMLElement;
                                if (divider && !isRightDragging) divider.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                const divider = e.currentTarget.children[0] as HTMLElement;
                                if (divider && !isRightDragging) divider.style.opacity = '0';
                            }}
                        >
                            <div style={{
                                width: '1px',
                                height: '100%',
                                backgroundColor: '#6366F1',
                                opacity: isRightDragging ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                margin: '0 auto',
                            }} />
                        </div>
                    )}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
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
        </div>
    )
}
