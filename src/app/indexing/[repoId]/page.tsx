'use client'

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useIndexingStream } from "@/hooks/useIndexingStream"
import { useRepos } from "@/hooks/useRepos"
import IndexingCard from "@/components/indexing/IndexingCard";
import IndexingBackground from "@/components/indexing/IndexingBackground";
import DashboardStarfield from "@/components/dashboard/DashboardStarfield";

export default function IndexingPage() {
    const params = useParams()
    const repoId = params.repoId as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session, status: sessionStatus } = useSession() as {
        data?: { backendToken?: string }
        status: 'loading' | 'authenticated' | 'unauthenticated'
    }
    const authToken = session?.backendToken

    const { state, reconnect } = useIndexingStream(repoId, authToken, sessionStatus)
    const { repos } = useRepos()
    
    const {
        status, totalFiles, indexedFiles, percentage,
        currentFile, completedFiles, errorMessage, repoName: streamRepoName,
    } = state

    const currentRepo = repos.find(r => String(r.backendId) === repoId)
    const displayRepoName = currentRepo?.fullName || streamRepoName
    
    // Fallback to database values if the SSE stream didn't provide progress 
    // (e.g. because the indexing was already done)
    const resolvedTotalFiles = totalFiles > 0 ? totalFiles : (currentRepo?.totalFiles || 0)
    const resolvedIndexedFiles = indexedFiles > 0 ? indexedFiles : (currentRepo?.indexedFiles || 0)

    const isDone = status === 'INDEXED' || currentRepo?.status === 'INDEXED'
    const resolvedStatus = isDone ? 'INDEXED' : status

    return (
        <div style={{
            minHeight: '100vh',
            height: isDone ? '100vh' : 'auto',
            overflow: isDone ? 'hidden' : 'auto',
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isDone ? 'center' : 'flex-start',
            padding: isDone ? '0 24px' : '48px 24px',
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        }}>
            {!isDone && <IndexingBackground />}
            {isDone && <DashboardStarfield />}

            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <IndexingCard
                    repoName={displayRepoName}
                    status={resolvedStatus}
                    totalFiles={resolvedTotalFiles}
                    indexedFiles={resolvedIndexedFiles}
                    percentage={percentage}
                    currentFile={currentFile}
                    completedFiles={completedFiles}
                    errorMessage={errorMessage}
                    repoId={repoId}
                    reconnect={reconnect}
                />
            </div>
        </div>
    )
}
