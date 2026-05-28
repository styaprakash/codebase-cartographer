import DashboardContent from '@/components/dashboard/DashboardContent'
// import type { RepoCardProps } from '@/components/dashboard/RepoCard'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

// const MOCK_REPOS: RepoCardProps[] = [
//     {
//         title: 'cartographer-core',
//         description:
//             'Main analysis engine for repository indexing and dependency graph generation.',
//         language: 'TypeScript',
//         languageColor: '#60A5FA',
//         status: 'ready',
//         actionLabel: 'Open',
//         repoId: 'cartographer-core',
//     },
//     {
//         title: 'nextjs-saas-template',
//         description:
//             'A robust template for launching SaaS products with authentication and billing.',
//         language: 'TypeScript',
//         status: 'indexing',
//         indexingProgress: 65,
//         indexingDetail: 'Analyzing 143 files...',
//     },
//     {
//         title: 'awesome-codebases',
//         description: 'Curated list of high-quality repositories for architectural study.',
//         language: 'Python',
//         languageColor: '#FACC15',
//         status: 'not_indexed',
//         actionLabel: 'Index Repo',
//         actionUrl: '#',
//     },
//     {
//         title: 'legacy-fortran-utils',
//         description: 'Internal utility library for legacy mainframe data parsing.',
//         language: 'Fortran',
//         languageColor: '#FB923C',
//         status: 'failed',
//         actionLabel: 'Retry',
//     },
//     {
//         title: 'distributed-cache',
//         description: 'High-performance distributed caching layer with Raft consensus.',
//         language: 'Go',
//         languageColor: '#06B6D4',
//         status: 'ready',
//         actionLabel: 'Open',
//         repoId: 'distributed-cache',
//     },
// ]

export default async function DashboardPage() {
    const session = await auth()

    //if nolt logged in -> just redirect to login
    if(!session) redirect('/auth/login')

    //Render the DashboardContent fetches ist own data using useRepos
    return <DashboardContent />
}
