import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    //Publuc routes: always accesible
    const publicRoutes = ['/', '/auth/login', '/auth/error']
    if(publicRoutes.includes(pathname)){
        //If logged in and trying to visit landing page, send to dashboard
        if(isLoggedIn && pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return NextResponse.next()
    } 

    //Protected route - redirects to login if not logged in
    if(!isLoggedIn) {
        return NextResponse.redirect(
            new URL('/auth/login', req.url)
        )
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
