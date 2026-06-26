'use client'

import { useEffect, useRef, useState } from 'react'
import { getSession } from 'next-auth/react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

interface ProgressPayload {
    status: string
    total_files: number
    progress: number
    file_path: string | null
}

interface FileCompletePayload {
    file: string
}

interface FileStartedPayload {
    file: string
}

interface StatusPayload {
    status: string
    errorMessage?: string
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

const MAX_COMPLETED_FILES = 200

export function useIndexingStream(
    repoId: string,
    authToken: string | undefined,
    sessionStatus: 'loading' | 'authenticated' | 'unauthenticated' = 'authenticated',
): IndexingStreamState {
    const [state, setState] = useState<IndexingStreamState>(INITIAL_STATE)

    // ── Refs: mutable values that do NOT trigger re-renders ──
    const abortControllerRef = useRef<AbortController | null>(null)
    const mountedRef = useRef(true)
    const isTerminalRef = useRef(false)

    // Stash token & session status in refs so the connection effect
    // never re-fires when they change — only repoId matters.
    const authTokenRef = useRef(authToken)
    const sessionStatusRef = useRef(sessionStatus)

    // Keep refs in sync with latest prop values (no effect re-trigger)
    useEffect(() => { authTokenRef.current = authToken }, [authToken])
    useEffect(() => { sessionStatusRef.current = sessionStatus }, [sessionStatus])

    // ── The single, stable connection effect ──
    // Only depends on repoId — the ONLY value that should tear down
    // and rebuild the SSE connection.
    useEffect(() => {
        mountedRef.current = true
        isTerminalRef.current = false

        if (!repoId) return

        // Wait for session to finish loading before connecting
        if (sessionStatusRef.current === 'loading') return

        const connect = async () => {
            let token = authTokenRef.current
            if (!token) {
                const session = await getSession()
                token = (session as { backendToken?: string } | null)?.backendToken
            }
            if (!token || !mountedRef.current) return

            // Abort any previous connection
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            abortControllerRef.current = new AbortController()

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
            const url = `${API_URL}/api/sse/indexing/${repoId}`

            fetchEventSource(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'text/event-stream',
                },
                signal: abortControllerRef.current.signal,

                onopen: async (res) => {
                    if (res.ok && res.status === 200) {
                        if (mountedRef.current) {
                            setState(prev => ({ ...prev, isConnected: true }))
                        }
                    } else {
                        throw new Error(`Connection failed: ${res.statusText}`)
                    }
                },

                onmessage: (event) => {
                    if (!mountedRef.current) return

                    // Handle the initial ping silently — no state change, no parse
                    if (event.event === 'connected') {
                        console.log('SSE stream connected:', event.data)
                        return
                    }

                    try {
                        if (event.event === 'progress') {
                            const data: ProgressPayload = JSON.parse(event.data)
                            setState(prev => ({
                                ...prev,
                                status: data.status,
                                totalFiles: data.totalFiles,
                                indexedFiles: data.indexedFiles,
                                percentage: data.percentage,
                                currentFile: data.currentFile,
                                isConnected: true,
                            }))
                        } else if (event.event === 'file_started') {
                            const data: FileStartedPayload = JSON.parse(event.data)
                            setState(prev => ({
                                ...prev,
                                currentFile: data.file,
                                isConnected: true,
                            }))
                        } else if (event.event === 'file_completed' || event.event === 'file_complete') {
                            const data: FileCompletePayload = JSON.parse(event.data)
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
                        } else if (event.event === 'file_event') {
                            // Backend sends unified file_event with status field
                            const data = JSON.parse(event.data)
                            if (data.status === 'indexing' || data.status === 'started') {
                                setState(prev => ({
                                    ...prev,
                                    currentFile: data.file_path ?? data.file,
                                    indexedFiles: data.progress ?? prev.indexedFiles,
                                    totalFiles: data.total_files ?? prev.totalFiles,
                                    isConnected: true,
                                }))
                            } else if (data.status === 'completed') {
                                const filePath = data.file_path ?? data.file
                                setState(prev => ({
                                    ...prev,
                                    completedFiles: (
                                        prev.completedFiles.length >= MAX_COMPLETED_FILES
                                            ? prev.completedFiles.slice(-(MAX_COMPLETED_FILES - 1))
                                            : prev.completedFiles
                                    ).concat(filePath),
                                    currentFile: null,
                                    indexedFiles: data.progress ?? prev.indexedFiles,
                                    totalFiles: data.total_files ?? prev.totalFiles,
                                    isConnected: true,
                                }))
                            }
                        } else if (event.event === 'status') {
                            const data: StatusPayload = JSON.parse(event.data)
                            if (
                                data.status === 'INDEXED' ||
                                data.status === 'FAILED'
                            ) {
                                isTerminalRef.current = true
                            }
                            setState(prev => ({
                                ...prev,
                                status: data.status,
                                errorMessage: data.errorMessage ?? prev.errorMessage,
                                isConnected: !isTerminalRef.current,
                            }))
                        }
                    } catch (e) {
                        console.error('SSE parse error:', e, 'event:', event.event, 'data:', event.data)
                    }
                },

                onclose: () => {
                    console.warn('SSE stream closed by server.')
                    if (isTerminalRef.current) {
                        return // Already handled terminal state in onmessage
                    }
                    if (mountedRef.current) {
                        setState(prev => {
                            if (prev.status !== 'FAILED') {
                                return { ...prev, isConnected: false, status: 'INDEXED' }
                            }
                            return { ...prev, isConnected: false }
                        })
                    }
                    isTerminalRef.current = true
                },

                onerror: (err) => {
                    console.error('SSE connection error:', err)
                    if (mountedRef.current) {
                        setState(prev => ({ ...prev, isConnected: false }))
                    }
                    if (isTerminalRef.current) {
                        throw err // Prevent retry after terminal status
                    }
                    // Otherwise fetchEventSource retries automatically
                },
            }).catch((err) => {
                if (!mountedRef.current) return
                console.error('SSE fatal error:', err)
            })
        }

        // Small delay to survive React Strict Mode's mount-unmount-remount
        // cycle in dev. If cleanup fires within 100ms, the fetch never starts.
        const connectTimer = setTimeout(() => {
            void connect()
        }, 100)

        // Cleanup: only fires when repoId changes or component unmounts
        return () => {
            clearTimeout(connectTimer)
            mountedRef.current = false
            isTerminalRef.current = true
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repoId])

    return state
}
