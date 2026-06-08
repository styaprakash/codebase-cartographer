'use client'

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useIndexingStatus } from "@/hooks/useIndexingStatus"
import IndexingCard from "@/components/indexing/IndexingCard";
import IndexingBackground from "@/components/indexing/IndexingBackground";

export default function IndexingPage() {
    const params = useParams()
    const repoId = params.repoId as string

    const { status, totalFiles, indexedFiles, errorMessage, repoName } =
        useIndexingStatus(repoId)

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
                    errorMessage={errorMessage}
                    repoId={repoId}
                />
            </div>
        </div>
    )
}
