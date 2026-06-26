//Github API repo shape
export interface GithubRepo {
    id: number
    name: string
    full_name: string
    description: string | null
    language: string | null
    default_branch: string
    private: boolean
    updated_at: string
}

//Our backend repo shape
export interface BackendRepo{
    id: string
    userId: string
    githubRepoId: string
    name: string
    fullName: string
    branch: string
    language:string | null
    status: 'PENDING' | 'INDEXING' | 'INDEXED' | 'FAILED'
    totalFiles: number
    indexedFiles: number
    errorMessage: string | null
    indexedAt: string | null
    createdAt: string
}


//Merged shape for UI
export interface DashboardRepo {
    githubId: number
    backendId: string | null
    name: string
    fullName: string
    description: string
    language: string | null
    branch: string
    status: 'INDEXED' | 'INDEXING' | 'PENDING' | 'FAILED' | 'NOT_INDEXED'
    totalFiles: number
    indexedFiles: number
    errorMessage: string | null   
}

// ── Embedding Models ────────────────────────────────
export type EmbeddingModel = 'qwen3' | 'embedding-gemma' | 'nv-embed-v2'

export interface ModelInfo {
    id: EmbeddingModel
    name: string
    description: string
    badge?: 'Recommended' | 'Coming Soon' | 'Experimental'
    available: boolean
}

export const AVAILABLE_MODELS: ModelInfo[] = [
    { id: 'qwen3', name: 'Qwen3 Embedding', description: 'Balanced speed and retrieval quality. Running locally through Ollama.', badge: 'Recommended', available: true },
    { id: 'embedding-gemma', name: 'EmbeddingGemma', description: 'Strong semantic understanding and documentation retrieval.', badge: 'Coming Soon', available: false },
    { id: 'nv-embed-v2', name: 'NVIDIA NV-Embed-v2', description: 'Highest retrieval quality for complex repositories.', badge: 'Coming Soon', available: false },
]

// ── File Tree Types ──────────────────────────────────
export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  language?: string       // file extension / detected language
}

// ── Chat / Query Types ──────────────────────────────
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: string[]
  timestamp: string
}

export interface SourceReference {
  filePath: string
  label: string
}

// ── Dependency Graph Types ──────────────────────────
export type NodeCategory = 'component' | 'service' | 'utility' | 'config'

export interface GraphNode {
  id: string
  label: string
  category: NodeCategory
  filePath: string
}

export interface GraphEdge {
  source: string
  target: string
}

export interface DependencyGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// ── File/Module Details ─────────────────────────────
export interface ModuleDetails {
  name: string
  filePath: string
  description: string
  functions: string[]
  incoming: string[]     // files that import this
  outgoing: string[]     // files this imports
}
