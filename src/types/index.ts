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
export type EmbeddingModel = 'OPENROUTER_QWEN_EMBEDDING' | 'GEMINI_EMBEDDING' | 'QWEN3_EMBEDDING'

export type BrandTheme = 'qwen' | 'gemini'

export interface ModelInfo {
    id: EmbeddingModel
    name: string
    description: string
    brandTheme: BrandTheme
}

export const AVAILABLE_MODELS: ModelInfo[] = [
    { id: 'OPENROUTER_QWEN_EMBEDDING', name: 'OpenRouter (Qwen3 8B)', description: 'Blazing fast cloud embeddings.', brandTheme: 'qwen' },
    { id: 'GEMINI_EMBEDDING', name: 'Google Gemini', description: "Strong semantic understanding using Gemini's text-embedding-004.", brandTheme: 'gemini' },
    { id: 'QWEN3_EMBEDDING', name: 'Local Qwen3 (Ollama)', description: 'Runs entirely locally on your hardware. Requires GPU.', brandTheme: 'qwen' },
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
