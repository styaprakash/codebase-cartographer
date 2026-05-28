import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
    (error) => {
        //401 if the toxen expired, redirects to login
        if(error.response.status === 401){
            window.location.href = '/auth/login'
        }
        return Promise.reject(error)
    }
)





// API Methods-------------------------------------------------
export const userApi = {
    getMe: () => api.get('/api/me')
}

export const repoApi = {
    getAll: () => api.get('/api/repos'),
    getById: (id: string) => api.get(`/api/repos/${id}`),
    create: (data: any) => api.get('/api/repos', data),
    triggerIndex: (id: string) => api.post(`/api/repos/${id}/index`),
    getStatus: (id: string) => api.get(`/api/repos/${id}/status`)
}

export const querApi = {
    ask: (repoId: string, question: string) => api.post(`/api/repos/${repoId}/query`, {question}),
    getHistory: (repoId: string) => {
        return api.get(`/api/repos/${repoId}/queries`)
    }
}

export const graphApi = {
    getGraph: (repoId: string) => api.get(`/api/repos/${repoId}/graph`),
    getFiles: (repoId: string) => api.get(`/api/repos/${repoId}/files`),
}

export default api