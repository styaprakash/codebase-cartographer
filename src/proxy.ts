import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const protectedPrefixes = ['/dashboard', '/setup', '/repo', '/indexing']

function isProtectedRoute(pathname: string): boolean {
    return protectedPrefixes.some(prefix => pathname.startsWith(prefix))
}

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // If hitting landing page while logged in → send to dashboard
    if (isLoggedIn && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If hitting a protected route while logged out → send to landing
    if (!isLoggedIn && isProtectedRoute(pathname)) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/dashboard/:path*', '/setup/:path*', '/repo/:path*', '/indexing/:path*', '/'],
}
