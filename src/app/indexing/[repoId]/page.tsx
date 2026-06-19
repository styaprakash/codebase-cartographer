'use client'

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useIndexingStream } from "@/hooks/useIndexingStream"
import IndexingCard from "@/components/indexing/IndexingCard";
import IndexingBackground from "@/components/indexing/IndexingBackground";

export default function IndexingPage() {
    const params = useParams()
    const repoId = params.repoId as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session, status: sessionStatus } = useSession() as {
        data?: { backendToken?: string }
        status: 'loading' | 'authenticated' | 'unauthenticated'
    }
    const authToken = session?.backendToken

    const {
        status, totalFiles, indexedFiles, percentage,
        currentFile, completedFiles, errorMessage, repoName,
    } = useIndexingStream(repoId, authToken, sessionStatus)

    const isDone = status === 'INDEXED'

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isDone ? '0' : '32px 24px',
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        }}>
            {!isDone && <IndexingBackground />}

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
                    repoName={repoName}
                    status={status}
                    totalFiles={totalFiles}
                    indexedFiles={indexedFiles}
                    percentage={percentage}
                    currentFile={currentFile}
                    completedFiles={completedFiles}
                    errorMessage={errorMessage}
                    repoId={repoId}
                />
            </div>
        </div>
    )
}
