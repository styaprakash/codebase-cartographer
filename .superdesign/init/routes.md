# Routes

Framework: Next.js 16 (App Router)

## Route Structure

| URL Path | File | Layout | Status |
|----------|------|--------|--------|
| `/` | `src/app/page.tsx` | RootLayout | ✅ Done — Landing page with Earth, stars, feature cards |
| `/auth/login` | `src/app/auth/login/page.tsx` | RootLayout | ✅ Done — Login page with GitHub button |
| `/dashboard` | `src/app/dashboard/page.tsx` | RootLayout | ❌ TODO — Empty file |
| `/repo/[repoId]` | N/A | RootLayout | ❌ TODO — Route file does not exist |
| `/settings` | N/A | RootLayout | ❌ TODO — Route directory does not exist |

## Pages Summary

### `/` — Landing Page
- Dark space background (`#050510`)
- 3 layers: StarField (z-index 2), Earth (z-index 5), Content (z-index 10)
- Content: headline "Codebase Cartographer", subtitle, description, GitHub CTA button, 3 feature cards
- Custom cyan cursor
- Parallax effect on mouse move

### `/auth/login` — Login Page
- Centered layout with dark background
- Heading "Sign in to Codebase Cartographer"
- GitHubButton component for OAuth

### `/dashboard` — Dashboard (TODO)
- Empty file, not implemented yet

### `/repo/[repoId]` — Repo Explorer (TODO)
- Route directory exists at `src/app/repo/` but no dynamic route file
- Todo components exist as empty files: `FileTree.tsx`, `ChatPanel.tsx`, `DependencyMap.tsx`, `DetailsPanel.tsx`

### `/settings` — Settings (TODO)
- Route directory does not exist
- Settings component exists at `src/components/settings/SettingsPage.tsx` (empty)
