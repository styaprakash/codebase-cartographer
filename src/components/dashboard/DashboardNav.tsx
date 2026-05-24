'use client'

import Link from 'next/link'
import { ChevronDown, LogOut, MapPin, Settings } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

function userHandle(name: string | null | undefined, email: string | null | undefined) {
    if (name) {
        const handle = name.toLowerCase().replace(/\s+/g, '_')
        return `@${handle}`
    }
    if (email) return `@${email.split('@')[0]}`
    return '@user'
}

export default function DashboardNav() {
    const { data: session } = useSession()
    const displayName = userHandle(session?.user?.name, session?.user?.email)
    const avatarUrl = session?.user?.image

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#1E1E2E]">
            <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6">
                <Link href="/" id="nav-logo" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center">
                        <MapPin className="text-white w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-[#F1F5F9]">Codebase</span>
                        <span className="text-[#06B6D4]"> Cartographer</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <button
                            id="user-menu-btn"
                            type="button"
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors"
                            aria-haspopup="true"
                        >
                            <div className="w-8 h-8 rounded-full border border-[#1E1E2E] overflow-hidden bg-[#111118]">
                                {avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">
                                        {(session?.user?.name?.[0] ?? 'U').toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-[#F1F5F9]">
                                {displayName}
                            </span>
                            <ChevronDown className="text-[#64748B] w-3 h-3" />
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-48 glass-card border-[#1E1E2E] rounded-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
                            <div className="p-2">
                                <Link
                                    href="/settings"
                                    id="menu-settings"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#F1F5F9] hover:bg-[#6366F1]/10 rounded-lg transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
