'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import type { GithubRepo } from '@/types'
import RepositorySetup from '@/components/setup/RepositorySetup'
import DashboardStarfield from '@/components/dashboard/DashboardStarfield'

interface Props {
    repoFullName: string
}

export default function SetupClient({ repoFullName }: Props) {
    const { data: session } = useSession()
    const router = useRouter()
    const [repo, setRepo] = useState<GithubRepo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const githubToken = (session as any)?.githubAccessToken
                if (!githubToken) return

                const res = await axios.get(
                    `https://api.github.com/repos/${repoFullName}`,
                    { headers: { Authorization: `Bearer ${githubToken}` } },
                )
                setRepo(res.data)
            } catch {
                router.push('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetchRepo()
    }, [session, repoFullName, router])

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748B' }}>Loading repository...</p>
            </div>
        )
    }

    if (!repo) {
        return (
            <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#EF4444' }}>Repository not found.</p>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#050510', position: 'relative', overflow: 'hidden' }}>
            <DashboardStarfield />
            <main style={{
                padding: '40px 32px',
                position: 'relative',
                zIndex: 10,
                fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
            }}>
                <RepositorySetup repo={repo} />
            </main>
        </div>
    )
}
