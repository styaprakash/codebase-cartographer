'use client'

import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Info, Plus, Minus, Maximize, Map } from 'lucide-react'
import { useDependencyGraph } from '@/hooks/useDependencyGraph'

interface DependencyMapProps {
    repoId: string
    selectedNodeId: string | null
    onSelectNode: (nodeId: string) => void
}

// Custom Node Component
const GlassNode = ({ data, selected }: any) => {
    // Map category to color
    const colorMap: Record<string, string> = {
        component: '#A855F7', // purple
        service: '#06B6D4',   // cyan
        utility: '#10B981',   // green
        config: '#F59E0B',    // orange
    }
    const color = colorMap[data.category] || '#6366F1'

    return (
        <div className="glass-panel node-glow" style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${color}80`, cursor: 'pointer', transition: 'all 0.2s', boxShadow: selected ? '0 0 0 2px #6366F1' : 'none' }}>
            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5F9' }}>{data.label}</span>
            </div>
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        </div>
    )
}

const nodeTypes = {
    glass: GlassNode,
}

export default function DependencyMap({ repoId, selectedNodeId, onSelectNode }: DependencyMapProps) {
    const { graph, isLoading, error } = useDependencyGraph(repoId)
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [showOnboarding, setShowOnboarding] = useState(true)

    // Transform API graph data to ReactFlow format
    useEffect(() => {
        if (!graph) return

        // Simple grid layout algorithm for demo purposes
        // In a real app, use dagre or elkjs for AST-aware layout
        const newNodes: Node[] = graph.nodes.map((n, i) => ({
            id: n.id,
            type: 'glass',
            position: { x: (i % 3) * 300 + 100, y: Math.floor(i / 3) * 150 + 100 },
            data: { label: n.label, category: n.category },
        }))

        const newEdges: Edge[] = graph.edges.map((e, i) => ({
            id: `e${i}-${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            animated: true,
            style: { stroke: '#6366F1', strokeWidth: 1.5, opacity: 0.4 },
            className: 'flowing-line',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#6366F1',
            },
        }))

        setNodes(newNodes)
        setEdges(newEdges)
    }, [graph, setNodes, setEdges])

    // Update selected state of nodes when selectedNodeId changes
    useEffect(() => {
        setNodes((nds) => 
            nds.map((node) => ({
                ...node,
                selected: node.id === selectedNodeId,
            }))
        )
    }, [selectedNodeId, setNodes])

    // Auto-hide onboarding
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowOnboarding(false)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        onSelectNode(node.id)
    }, [onSelectNode])

    if (isLoading) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508' }}>
                <div style={{ color: '#6366F1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '32px', height: '32px', border: '4px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Generating Map...</span>
                </div>
            </div>
        )
    }

    if (error || !graph) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508' }}>
                <div style={{ color: '#F87171', fontSize: '12px' }}>Failed to load dependency map.</div>
            </div>
        )
    }

    return (
        <div id="dep-map-view" style={{ height: '100%', position: 'relative', backgroundColor: '#050508', overflow: 'hidden' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }} // Hide watermark
            >
                <Background color="#1E1E2E" gap={20} size={1} />
                
                {/* We use our own custom UI for controls/minimap matching the design */}
                {/* <Controls /> */}
                {/* <MiniMap /> */}
            </ReactFlow>

            {/* Onboarding Tooltip */}
            <div 
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#4F46E5',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 50,
                    transition: 'all 1s',
                    opacity: showOnboarding ? 1 : 0,
                    pointerEvents: showOnboarding ? 'auto' : 'none',
                    animation: showOnboarding ? 'bounce 1s infinite' : 'none'
                }}
            >
                <Info size={14} />
                These are your modules. Click any node to explore.
            </div>

            {/* Bottom Left Legend & Controls */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
                <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px', border: '1px solid #1E1E2E', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#64748B' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A855F7' }}></div> Component
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#64748B' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }}></div> Service
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#64748B' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div> Utility
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#64748B' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div> Config
                    </div>
                </div>
                
                {/* Custom Controls UI (visual only for this implementation, would tie to ReactFlow instance in full version) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '8px', padding: '4px' }}>
                    <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#64748B', transition: 'all 0.2s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1E1E2E'; e.currentTarget.style.color = '#F1F5F9'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <Plus size={14} />
                    </button>
                    <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#64748B', transition: 'all 0.2s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1E1E2E'; e.currentTarget.style.color = '#F1F5F9'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <Minus size={14} />
                    </button>
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#1E1E2E', margin: '0 4px' }}></div>
                    <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#64748B', transition: 'all 0.2s', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1E1E2E'; e.currentTarget.style.color = '#F1F5F9'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                        <Maximize size={14} />
                    </button>
                </div>
            </div>

            {/* Custom Minimap UI */}
            <div className="glass-panel" style={{ position: 'absolute', bottom: '24px', right: '24px', width: '192px', height: '128px', border: '1px solid #1E1E2E', borderRadius: '12px', overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ width: '100%', height: '100%', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Map size={36} color="#64748B" />
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '32px', border: '1px solid rgba(99, 102, 241, 0.5)', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '4px' }}></div>
            </div>
        </div>
    )
}
