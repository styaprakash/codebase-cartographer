# Codebase Cartographer — Frontend Reference

> **Status:** Paused at landing page (Earth + stars renders, GitHub button needs NextAuth wired)  
> **Resume from:** Wiring `signIn('github')` in `GitHubButton.tsx` after backend is complete  
> **Stack:** Next.js 14 (App Router) · Tailwind v4 · shadcn/ui · Bun

---

## Folder Structure

```
src/
├── app/
│   ├── page.tsx                        ← Landing page (Server Component)
│   ├── layout.tsx                      ← Root layout (Geist font, globals.css)
│   ├── globals.css                     ← All CSS variables, keyframes, utility classes
│   ├── dashboard/
│   │   └── page.tsx                    ← Repo grid dashboard (TODO)
│   ├── repo/
│   │   └── [repoId]/
│   │       └── page.tsx                ← Repo Explorer 3-panel (TODO)
│   ├── settings/
│   │   └── page.tsx                    ← Settings page (TODO)
│   └── auth/
│       └── login/
│           └── page.tsx                ← GitHub OAuth login page (TODO)
│
├── components/
│   ├── landing/
│   │   ├── StarField.tsx               ← Stars + shake + parallax (DONE)
│   │   ├── Earth.tsx                   ← Rotating Earth + atmosphere (DONE)
│   │   ├── FeatureCards.tsx            ← 3 glass cards at bottom (DONE)
│   │   └── GitHubButton.tsx            ← CTA button — needs signIn('github') wired
│   │
│   ├── dashboard/
│   │   ├── RepoGrid.tsx                ← 3-col repo card grid (TODO)
│   │   ├── RepoCard.tsx                ← Single repo card + status badge (TODO)
│   │   └── EmptyState.tsx              ← First-time empty state (TODO)
│   │
│   ├── explorer/
│   │   ├── FileTree.tsx                ← Left panel — file tree (TODO)
│   │   ├── ChatPanel.tsx               ← Center — Ask AI tab (TODO)
│   │   ├── DependencyMap.tsx           ← Center — Dependency Map tab (TODO)
│   │   └── DetailsPanel.tsx            ← Right panel — file details (TODO)
│   │
│   ├── indexing/
│   │   └── IndexingOverlay.tsx         ← Progress overlay modal (TODO)
│   │
│   └── settings/
│       └── SettingsPage.tsx            ← Account + usage + danger zone (TODO)
│
├── lib/
│   ├── api.ts                          ← All axios calls to Spring Boot (TODO)
│   └── auth.ts                         ← NextAuth config (TODO)
│
└── types/
    └── index.ts                        ← Shared TypeScript types (TODO)
```

---

## Status Tracker

| Component | Status | Blocked By |
|-----------|--------|-----------|
| `globals.css` | ✅ Done | — |
| `tailwind.config.ts` | ✅ Done | — |
| `StarField.tsx` | ✅ Done | — |
| `Earth.tsx` | ✅ Done | — |
| `FeatureCards.tsx` | ✅ Done | — |
| `page.tsx` (landing) | ✅ Done | — |
| `GitHubButton.tsx` | ⚠️ Partial | Needs NextAuth `signIn('github')` |
| `auth/login/page.tsx` | ❌ TODO | NextAuth setup |
| `dashboard/page.tsx` | ❌ TODO | Backend API GET /api/repos |
| `RepoGrid.tsx` | ❌ TODO | Backend API |
| `RepoCard.tsx` | ❌ TODO | Backend API |
| `EmptyState.tsx` | ❌ TODO | — |
| `IndexingOverlay.tsx` | ❌ TODO | Backend POST /api/repos/:id/index |
| `FileTree.tsx` | ❌ TODO | Backend GET /api/repos/:id/files |
| `ChatPanel.tsx` | ❌ TODO | Backend POST /api/repos/:id/query |
| `DependencyMap.tsx` | ❌ TODO | Backend GET /api/repos/:id/graph |
| `DetailsPanel.tsx` | ❌ TODO | Backend GET /api/repos/:id/graph |
| `SettingsPage.tsx` | ❌ TODO | Backend GET /api/me |
| `middleware.ts` | ❌ TODO | After auth works |

---

## Where We Left Off — Landing Page

### What Works
- Dark space background (`#050510`)
- 150 stars with shake effect on cursor move (120px radius)
- Rotating Earth with atmosphere glow + cloud drift
- Parallax: Earth moves more than stars on mouse move
- Custom cyan cursor
- 3 feature cards with glassmorphism hover
- All animations via `globals.css` keyframes

### What Needs Fixing
```tsx
// src/components/landing/GitHubButton.tsx
// Replace the console.log with this after NextAuth is set up:

'use client'
import { signIn } from 'next-auth/react'

export default function GitHubButton() {
  return (
    <button
      onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
      className="cc-cta inline-flex items-center gap-3 px-6 py-3
                 rounded-full text-base font-semibold mb-3 bg-white text-black"
    >
      <GitHubIcon />
      Continue with GitHub
    </button>
  )
}
```

### Known Issue
- Chrome redirects to `/auth/login` from cached session — use Firefox or incognito during dev

---

## Design Tokens (from globals.css)

```css
--indigo:          #6366F1   /* primary brand */
--cyan:            #06B6D4   /* accent */
--green:           #10B981   /* success */
--amber:           #EF9F27   /* warning */
--red:             #EF4444   /* error / danger */
--bg-base:         #050510   /* page background */
--bg-surface:      #0D0D1A   /* cards, panels */
--bg-elevated:     #111124   /* modals */
--border:          #1E1E2E   /* default border */
--text-primary:    #F1F5F9
--text-secondary:  #94A3B8
--text-muted:      #64748B
```

## Utility Classes (from globals.css)

| Class | What it does |
|-------|-------------|
| `.cc-glass` | Dark frosted glass card with hover glow |
| `.cc-progress-fill` | Indigo→cyan gradient bar |
| `.cc-dot-pulse` | Pulsing status dot animation |
| `.cc-skeleton` | Shimmer loading skeleton |
| `.cc-cursor` | Custom cyan cursor style |
| `.cc-cta` | Button lift on hover |

---

## Dependencies Installed

```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "next-auth": "^5.x (beta)",
    "reactflow": "^11.x",
    "react-syntax-highlighter": "^15.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "ioredis": "^5.x",
    "axios": "^1.x",
    "three": "^0.x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x",
    "@aws-sdk/client-sqs": "^3.x",
    "@aws-sdk/client-s3": "^3.x",
    "@aws-sdk/client-bedrock-runtime": "^3.x"
  }
}
```

---

## TypeScript Types (fill in `src/types/index.ts` later)

```ts
export interface User {
  id:              string
  githubId:        string
  name:            string
  email:           string
  dailyQueryCount: number
  queryResetAt:    string
}

export interface Repository {
  id:           string
  name:         string
  fullName:     string
  branch:       string
  language:     string
  status:       'pending' | 'indexing' | 'indexed' | 'failed'
  totalFiles:   number
  indexedFiles: number
  errorMessage?: string
  indexedAt?:   string
}

export interface CodeChunk {
  id:        string
  repoId:    string
  filePath:  string
  chunkType: 'function' | 'class' | 'module' | 'unknown'
  chunkName: string
  content:   string
  startLine: number
  endLine:   number
}

export interface QueryLog {
  id:           string
  question:     string
  answer:       string
  sourceChunks: string[]
  tokensUsed:   number
  createdAt:    string
}

export interface GraphNode {
  id:    string
  label: string
  type:  'component' | 'service' | 'utility' | 'config'
}

export interface GraphEdge {
  source: string
  target: string
}
```

---

## API Calls to Build in `src/lib/api.ts`

```ts
// These connect to Spring Boot backend (localhost:8080 in dev)
const BASE = process.env.NEXT_PUBLIC_API_URL // 'http://localhost:8080'

getMe()                            → GET  /api/me
getRepos()                         → GET  /api/repos
indexRepo(repoId)                  → POST /api/repos/:id/index
getIndexStatus(repoId)             → GET  /api/repos/:id/status
queryRepo(repoId, question)        → POST /api/repos/:id/query  (SSE stream)
getGraph(repoId)                   → GET  /api/repos/:id/graph
```

---

## Pages to Build (resume order)

```
1. auth/login/page.tsx         → after NextAuth configured (Week 1 backend done)
2. dashboard/page.tsx          → after GET /api/repos works
3. repo/[repoId]/page.tsx      → after indexing pipeline works
4. settings/page.tsx           → after GET /api/me works
5. middleware.ts               → last, after all auth works
```

---

## Notes

- **Superdesign files saved at:** All 5 pages exported as HTML in project root `/design/`
- **Design reference:** See `codebase_cartographer_complete_guide.pdf`
- **Color source of truth:** `globals.css` CSS variables (not Tailwind config)
- **Component library:** shadcn/ui (Radix + Custom preset)
- **Package manager:** Bun only — never run `npm install` in this project
