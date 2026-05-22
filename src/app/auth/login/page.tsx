import GitHubButton from '@/components/landing/GitHubButton'

export default function LoginPage() {
    return(
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#050510]">
        <h1 className="text-3xl font-bold text-white mb-2">
            Sign in to{' '}
            <span style={{ color: '#06B6D4' }}>Codebase Cartographer</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: '#64748B' }}>
            Connect your GitHub to get started
        </p>
        <GitHubButton />
        </main>
    )
}