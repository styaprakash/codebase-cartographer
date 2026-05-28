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


