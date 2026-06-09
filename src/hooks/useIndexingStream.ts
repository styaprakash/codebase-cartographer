'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ProgressPayload {
    status: string
    totalFiles: number
    indexedFiles: number
    percentage: number
    currentFile: string | null
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
): IndexingStreamState {
    const [state, setState] = useState<IndexingStreamState>(INITIAL_STATE)

    const esRef = useRef<EventSource | null>(null)
    const reconnectAttempt = useRef(0)
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const mountedRef = useRef(true)
    const isTerminalRef = useRef(false)
    const connectRef = useRef<(() => void) | null>(null)

    const connect = useCallback(() => {
        if (!authToken || !repoId || !mountedRef.current) return

        if (esRef.current) {
            esRef.current.close()
            esRef.current = null
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${repoId}/stream`
        const es = new EventSource(
            `${url}?token=${encodeURIComponent(authToken)}`,
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

        es.addEventListener('progress', (e: MessageEvent) => {
            if (!mountedRef.current) return
            const data: ProgressPayload = JSON.parse(e.data)
            setState(prev => ({
                ...prev,
                status: data.status,
                totalFiles: data.totalFiles,
                indexedFiles: data.indexedFiles,
                percentage: data.percentage,
                currentFile: data.currentFile,
                isConnected: true,
            }))
        })

        es.addEventListener('file_complete', (e: MessageEvent) => {
            if (!mountedRef.current) return
            const data: FileCompletePayload = JSON.parse(e.data)
            setState(prev => ({
                ...prev,
                completedFiles: (
                    prev.completedFiles.length >= MAX_COMPLETED_FILES
                        ? prev.completedFiles.slice(-(MAX_COMPLETED_FILES - 1))
                        : prev.completedFiles
                ).concat(data.file),
                currentFile: null,
                isConnected: true,
            }))
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
                reconnectTimer.current = setTimeout(() => connectRef.current?.(), delay)
            }
        }
    }, [repoId, authToken])

    useEffect(() => {
        connectRef.current = connect
    }, [connect])

    useEffect(() => {
        mountedRef.current = true
        isTerminalRef.current = false

        connect()

        return () => {
            mountedRef.current = false
            isTerminalRef.current = true
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current)
                reconnectTimer.current = null
            }
            if (esRef.current) {
                esRef.current.close()
                esRef.current = null
            }
        }
    }, [connect])

    return state
}
