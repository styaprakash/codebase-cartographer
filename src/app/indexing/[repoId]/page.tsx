'use client'

import { useParams, useRouter } from "next/navigation";
import { useIndexingStatus } from "@/hooks/useIndexingStatus"
import { useEffect } from "react";
import IndexingCard from "@/components/indexing/IndexingCard";
import IndexingBackground from "@/components/indexing/IndexingBackground";

export default function IndexingPage() {
    const params = useParams()
    const router = useRouter()
    const repoId = params.repoId as string

    const { status, totalFiles, indexedFiles, errorMessage, repoName } =
        useIndexingStatus(repoId)

    useEffect(() => {
        if (status === 'INDEXED') {
            setTimeout(() => router.push(`/repo/${repoId}`), 1500)
        }
    }, [status, repoId, router]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif'
        }}>
            <IndexingBackground />

            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
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
