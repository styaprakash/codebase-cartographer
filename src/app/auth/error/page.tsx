'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const messages: Record<string, string> = {
        OAuthAccountNotLinked: 'This GitHub account is already linked to another user.',
        OAuthSignin: 'There was a problem signing you in with GitHub.',
        OAuthCallback: 'There was a problem during the GitHub callback.',
        AccessDenied: 'Sign in was denied. Your backend may have rejected the request.',
        default: 'An unexpected authentication error occurred.',
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#050510]">
            <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-sm mb-8 max-w-md text-center" style={{ color: '#EF4444' }}>
                {messages[error ?? ''] || messages.default}
            </p>
            {error && (
                <p className="text-xs mb-8" style={{ color: '#64748B' }}>
                    Error code: {error}
                </p>
            )}
            <Link
                href="/auth/login"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-base font-semibold bg-white text-black"
            >
                Try again
            </Link>
        </main>
    )
}

export default function ErrorPage() {
    return (
        <Suspense>
            <ErrorContent />
        </Suspense>
    )
}
