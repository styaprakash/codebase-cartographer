import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'

const API_URL = '/api/proxy'

//Create axios instance with base URL
const api = axios.create({
    baseURL:API_URL,
    headers:{
        'Content-Type': 'application/json',
    }
})

// Interceptor — adds JWT token to every request automatically
// Runs before every API call
api.interceptors.request.use(async (config) => {
    const session = await getSession()

    //If user is logged in -> add token to Authorization header
    if(session){
        const backendToken = (session as any).backendToken
        if(backendToken) {
            config.headers.Authorization = `Bearer ${backendToken}`
        }
    }

    return config
})

// Interceptor — handles errors globally
// Runs after every API response
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // 401 if the token expired or is missing — clear session and redirect to landing
        if (error.response?.status === 401) {
            await signOut({ redirect: false })
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                window.location.href = '/'
            }
        }
        return Promise.reject(error)
    }
)





// API Methods-------------------------------------------------
export const userApi = {
    getMe: () => api.get('/me')
}

export const repoApi = {
    getAll: () => api.get('/repos'),
    getById: (id: string) => api.get(`/repos/${id}`),
    create: (data: any) => api.post('/repos', data),
    triggerIndex: (id: string, metadata?: any) => api.post(`/repos/${id}/index`, metadata),
    getStatus: (id: string) => api.get(`/repos/${id}/status`)
}

export const querApi = {
    ask: (repoId: string, question: string, llmProvider: string) => api.post(`/chat/${repoId}`, { query: question, llmProvider }),
    getHistory: (repoId: string) => {
        return api.get(`/repos/${repoId}/queries`)
    }
}

export const graphApi = {
    getGraph: (repoId: string) => api.get(`/repos/${repoId}/graph`),
    getFiles: (repoId: string) => api.get(`/repos/${repoId}/files`),
}

export default api