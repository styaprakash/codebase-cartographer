'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getSession } from 'next-auth/react'

interface ProgressPayload {
    status: string
    total_files: number
    progress: number
    file_path: string | null
}

interface FileCompletePayload {
    file: string
}

interface StatusPayload {
    status: string
    error?: string
}

export interface IndexingStreamState {
    status: string
    totalFiles: number
    indexedFiles: number
    percentage: number
    currentFile: string | null
    completedFiles: string[]
    errorMessage: string | null
    repoName: string
    isConnected: boolean
}

const INITIAL_STATE: IndexingStreamState = {
    status: 'PENDING',
    totalFiles: 0,
    indexedFiles: 0,
    percentage: 0,
    currentFile: null,
    completedFiles: [],
    errorMessage: null,
    repoName: '',
    isConnected: false,
}

const BASE_DELAY = 5000
const MAX_RETRIES = 5
const MAX_COMPLETED_FILES = 200

export function useIndexingStream(
    repoId: string,
    authToken: string | undefined,
    sessionStatus: 'loading' | 'authenticated' | 'unauthenticated' = 'authenticated',
): IndexingStreamState {
    const [state, setState] = useState<IndexingStreamState>(INITIAL_STATE)

    const esRef = useRef<EventSource | null>(null)
    const reconnectAttempt = useRef(0)
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const mountedRef = useRef(true)
    const isTerminalRef = useRef(false)
    const connectRef = useRef<(() => void) | null>(null)
    const pendingFilesRef = useRef<string[]>([])
    const latestProgressRef = useRef<ProgressPayload | null>(null)
    const lastSeenFileRef = useRef<string | null>(null)
    const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const connect = useCallback(async () => {
        if (!repoId || !mountedRef.current || sessionStatus === 'loading') return

        let token = authToken
        if (!token) {
            const session = await getSession()
            token = (session as { backendToken?: string } | null)?.backendToken
        }
        if (!token || !mountedRef.current) return

        if (esRef.current) {
            esRef.current.close()
            esRef.current = null
        }
        if (flushIntervalRef.current) {
            clearInterval(flushIntervalRef.current)
            flushIntervalRef.current = null
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${repoId}/stream`
        const es = new EventSource(
            `${url}?access_token=${encodeURIComponent(token)}`,
        )
        esRef.current = es

        es.onopen = () => {
            if (!mountedRef.current) {
                es.close()
                return
            }
            reconnectAttempt.current = 0
            setState(prev => ({ ...prev, isConnected: true }))
        }

        // Setup 150ms batched flush interval
        flushIntervalRef.current = setInterval(() => {
            if (!mountedRef.current) return
            
            const latest = latestProgressRef.current
            const pendingFiles = pendingFilesRef.current

            if (!latest && pendingFiles.length === 0) return

            setState(prev => {
                let nextCompleted = prev.completedFiles
                if (pendingFiles.length > 0) {
                    // Prepend new pending files (most recent first)
                    const newFiles = [...pendingFiles].reverse()
                    nextCompleted = [...newFiles, ...prev.completedFiles]
                    
                    // Deduplicate and slice to keep memory low
                    nextCompleted = Array.from(new Set(nextCompleted)).slice(0, 10)
                }

                return {
                    ...prev,
                    status: latest ? latest.status : prev.status,
                    totalFiles: latest ? (latest.total_files || prev.totalFiles) : prev.totalFiles,
                    indexedFiles: latest ? (latest.progress || prev.indexedFiles) : prev.indexedFiles,
                    percentage: latest && latest.total_files > 0 ? Math.round((latest.progress / latest.total_files) * 100) : prev.percentage,
                    currentFile: latest ? latest.file_path : prev.currentFile,
                    completedFiles: nextCompleted,
                    isConnected: true,
                }
            })

            // Clear buffers
            pendingFilesRef.current = []
            latestProgressRef.current = null
        }, 150)

        es.addEventListener('progress', (e: MessageEvent) => {
            if (!mountedRef.current) return
            const data: ProgressPayload = JSON.parse(e.data)
            
            // If the file changed, buffer the last seen file
            if (lastSeenFileRef.current && lastSeenFileRef.current !== data.file_path) {
                pendingFilesRef.current.push(lastSeenFileRef.current)
            }
            if (data.file_path) {
                lastSeenFileRef.current = data.file_path
            }
            
            latestProgressRef.current = data
        })

        es.addEventListener('file_complete', (e: MessageEvent) => {
            if (!mountedRef.current) return
            const data: FileCompletePayload = JSON.parse(e.data)
            pendingFilesRef.current.push(data.file)
        })

        es.addEventListener('status', (e: MessageEvent) => {
            if (!mountedRef.current) return
            const data: StatusPayload = JSON.parse(e.data)
            if (
                data.status === 'INDEXED' ||
                data.status === 'FAILED'
            ) {
                isTerminalRef.current = true
            }
            setState(prev => ({
                ...prev,
                status: data.status,
                errorMessage: data.error ?? prev.errorMessage,
                isConnected: true,
            }))
        })

        es.onerror = () => {
            if (!mountedRef.current) return

            setState(prev => ({ ...prev, isConnected: false }))
            es.close()
            esRef.current = null

            if (isTerminalRef.current) return

            if (reconnectAttempt.current < MAX_RETRIES) {
                const delay =
                    BASE_DELAY * Math.pow(2, reconnectAttempt.current)
                reconnectAttempt.current += 1
                reconnectTimer.current = setTimeout(
                    () => void connectRef.current?.(),
                    delay,
                )
            }
        }
    }, [repoId, authToken, sessionStatus])

    useEffect(() => {
        connectRef.current = connect
    }, [connect])

    useEffect(() => {
        mountedRef.current = true
        isTerminalRef.current = false

        void connect()

        return () => {
            mountedRef.current = false
            isTerminalRef.current = true
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current)
                reconnectTimer.current = null
            }
            if (flushIntervalRef.current) {
                clearInterval(flushIntervalRef.current)
                flushIntervalRef.current = null
            }
            if (esRef.current) {
                esRef.current.close()
                esRef.current = null
            }
        }
    }, [connect])

    return state
}
