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
        <nav className="fixed top-0 z-50 w-full border-b border-border-dark bg-[#0A0A0F]/80 px-6 py-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="group flex items-center gap-2 no-underline">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo to-cyan">
                        <MapPin className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-text-primary">Codebase</span>
                        <span className="text-cyan"> Cartographer</span>
                    </span>
                </Link>

                <div className="group relative">
                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-white/5"
                        aria-haspopup="true"
                    >
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-border-dark bg-[#111118]">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-indigo/20 text-xs font-bold text-indigo">
                                    {(session?.user?.name?.[0] ?? 'U').toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="hidden text-sm font-medium text-text-primary sm:inline">
                            {displayName}
                        </span>
                        <ChevronDown className="hidden h-3.5 w-3.5 text-text-muted sm:block" />
                    </button>

                    <div className="cc-dashboard-nav-dropdown pointer-events-none absolute right-0 top-full mt-2 w-48 translate-y-2 rounded-xl opacity-0 transition-all group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="p-2">
                            <Link
                                href="/settings"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-primary no-underline transition-colors hover:bg-indigo/10"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <button
                                type="button"
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-400/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
