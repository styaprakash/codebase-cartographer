'use client'

import { ArrowRight, MapPin } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function EmptyState() {
    return (
        <div id="empty-state" className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-12">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#6366F1]/10 to-[#06B6D4]/10 blur-3xl absolute -inset-4"></div>
                <div className="relative w-48 h-48 border border-[#1E1E2E] rounded-2xl flex items-center justify-center bg-[#111118]/50 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(#1E1E2E 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                        }}
                    />
                    <MapPin className="relative text-7xl text-[#6366F1] animate-bounce w-16 h-16" />
                </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">Map your first codebase</h2>
            <p className="text-lg text-[#64748B] max-w-xl mb-10">
                Connect a GitHub repo and the AI will index every file, function, and module for you.
            </p>

            <button
                type="button"
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="cc-cta inline-flex items-center gap-3 px-8 py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-full text-lg font-bold shadow-lg shadow-[#6366F1]/20"
            >
                Choose a Repository
                <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-sm text-[#64748B] mt-6">
                Works with public and private repos
            </p>
        </div>
    )
}
