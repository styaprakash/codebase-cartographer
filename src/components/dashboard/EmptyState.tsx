'use client'

import { ArrowRight, MapPin } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-12">
                <div className="absolute -inset-4 h-64 w-64 rounded-full bg-gradient-to-br from-indigo/10 to-cyan/10 blur-3xl" />
                <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-border-dark bg-[#111118]/50">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(#1E1E2E 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                        }}
                    />
                    <MapPin className="relative h-16 w-16 animate-bounce text-indigo" />
                </div>
            </div>

            <h2 className="mb-4 text-4xl font-bold text-text-primary">Map your first codebase</h2>
            <p className="mb-10 max-w-xl text-lg text-text-muted">
                Connect a GitHub repo and the AI will index every file, function, and module for you.
            </p>

            <button
                type="button"
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="cc-cta inline-flex items-center gap-3 rounded-full bg-indigo px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo/20 transition-colors hover:bg-[#4F46E5]"
            >
                Choose a Repository
                <ArrowRight className="h-5 w-5" />
            </button>

            <p className="mt-6 text-sm text-text-muted">Works with public and private repos</p>
        </div>
    )
}
