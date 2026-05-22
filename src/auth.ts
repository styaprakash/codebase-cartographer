import NextAuth from "next-auth";
import Github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        })
        
    ],
    callbacks: {
        async signIn({ user, account }){
            try{
                //send github user data + acces token to backend
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            githubId: account?.providerAccountId,
                            name: user.name,
                            email: user.email,
                            accessToken: account?.access_token
                        })
                    }
                )

                if(!response.ok){
                    console.error('Backend auth failed:', response.status)
                    return false; // block login if backend fails
                }

                const data = await response.json()

                // Store temporary values on user object
                // jwt() callback will read these
                const userData = user as any
                userData.backendToken = data.token
                userData.userId = data.user.id

                return true; //allow login
            } catch(error){
                console.error('Auth Callback error: ', error)
                return false;
            }
        },

        // ── jwt ─────────────────────────────────────────────────────
        // Runs:
        // 1. On first login
        // 2. On every authenticated request
        async jwt({ token, user }){
            //only available dring first login
            if(user){
                const userData = user as any
                token.backendToken = userData.backendToken
                token.userId = userData.userId

                token.name = user.name
                token.email = user.email
            }

            return token;
        },

        // ── session ─────────────────────────────────────────────────
        // Makes token data available to frontend
        async session({ session, token }){
            //custom backend JWt
            ;(session as any).backendToken = token.backendToken;

            session.user.id = token.userId as string
            session.user.name  = token.name  as string
            session.user.email = token.email as string

            return session
        }
    },
    // ── Pages ──────────────────────────────────────────────────────
    // Tell NextAuth where your custom pages are
    pages: {
        signIn: '/auth/login',   // redirect here when login needed
        error:  '/auth/error',   // redirect here on auth errors
    },
})