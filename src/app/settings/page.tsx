import Link from 'next/link'

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-dark-bg px-6 py-16 text-text-primary">
            <div className="mx-auto max-w-lg">
                <Link href="/dashboard" className="text-sm text-cyan no-underline hover:underline">
                    ← Back to dashboard
                </Link>
                <h1 className="mt-4 text-2xl font-bold">Settings</h1>
                <p className="mt-2 text-text-muted">Coming soon.</p>
            </div>
        </div>
    )
}
