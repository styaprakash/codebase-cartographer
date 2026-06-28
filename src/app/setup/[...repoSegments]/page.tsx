import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SetupClient from './SetupClient'

interface PageProps {
    params: Promise<{ repoSegments: string[] }>
}

export default async function SetupPage({ params }: PageProps) {
    const session = await auth()
    if (!session) redirect('/')

    const resolvedParams = await params
    // Join segments back to form owner/repo
    const repoFullName = resolvedParams.repoSegments.join('/')
    return <SetupClient repoFullName={repoFullName} />
}
