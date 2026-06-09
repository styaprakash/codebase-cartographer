/**
 * @deprecated Use useIndexingStream instead, which provides
 * real-time SSE-based indexing status with completedFiles,
 * currentFile, percentage, and isConnected.
 */

export function useIndexingStatus(_repoId: string) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn(
            'useIndexingStatus is deprecated. Migrate to useIndexingStream.',
        )
    }

    return {
        status: 'PENDING' as const,
        totalFiles: 0,
        indexedFiles: 0,
        errorMessage: null,
        repoName: '',
    }
}
