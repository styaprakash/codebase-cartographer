# Implementation Plan: Codebase Cartographer Dashboard

> **Design fetched from SuperDesign**  
> Project: `76453478-688f-42ae-b473-d156395da9e9`  
> Draft: `27810115-ea71-408f-98fb-2d490e18f046` — *Codebase Cartographer Dashboard*  
> HTML reference: [`.superdesign/dashboard-design.html`](./dashboard-design.html)

---

## Design overview

The dashboard is a **space-themed repository hub** aligned with the landing page aesthetic. It has two mutually exclusive views:

1. **First-time / no repos** — full-viewport empty state with hero illustration and “Choose a Repository” CTA.
2. **Returning user** — sticky nav, page header, dismissible onboarding banner, search, and a responsive card grid.

Ambient polish: fixed starfield background, custom cyan cursor, glass repo cards with hover glow + optional 3D tilt, and five repo card status variants.

---

## Current vs. design comparison

| Area | Current (`src/app/dashboard/`) | Design target |
|------|-------------------------------|---------------|
| **Page modes** | Empty banner **and** repo grid shown together | Empty **or** grid — never both |
| **Header** | Sticky text brand + Settings link | Fixed nav: gradient logo tile + user avatar dropdown (Settings, Disconnect) |
| **Background** | Flat `#050510` | Radial gradient `#0D0D14 → #050510` + ~100 star dots (`star-bg`) |
| **Cursor** | Default | Cyan dot cursor (`custom-cursor`), `cursor: crosshair` on body |
| **Empty state** | Compact dashed GitHub connect banner | Full-page hero: grid mock, bouncing map-pin, pill CTA “Choose a Repository” |
| **Page header** | `text-1.5rem` title + subtitle below banner | `text-4xl` “Your Repositories” + **New Repo** button (top right) |
| **Onboarding** | Subtitle only | Dismissible **helper banner** (sparkles + copy + close) |
| **Search** | None | Full-width search input with focus glow |
| **Repo grid** | `minmax(300px, 1fr)` | `1 / 2 / 3` cols at md/lg, `gap-6` |
| **Card layout** | Title row + pill status + description + footer | Icon tile + uppercase status badge; language = colored dot + label |
| **Card statuses** | `indexed` \| `indexing` \| `unindexed` | `ready` \| `indexing` \| `not_indexed` \| `failed` (+ progress for indexing) |
| **Card hover** | `.cc-glass` border glow only | Lift + scale + mouse-tracking radial highlight + 3D tilt (`data-tilt`) |
| **Actions** | Open (indigo gradient pill) / Index (cyan outline pill) | Open (**green** `rounded-lg`), Index (**indigo** outline + zap), Retry (**red** outline) |
| **Not indexed card** | Same glass as others | Dashed border, transparent background |
| **Failed card** | Not implemented | Red border + shadow, alert icon, Retry button |
| **Indexing card** | Spinner badge only | Amber badge pulse + **progress bar** + “Analyzing N files…” + % |
| **Icons** | `lucide-react` | `iconify-icon` in draft — **keep lucide** in app |
| **Font** | Geist (layout) | Inter in draft — **keep Geist** |
| **Body bg token** | `#050510` | `#0A0A0F` nav/surface — align via CSS vars or Tailwind `dark-bg` |

---

## Target component tree

```
src/app/dashboard/page.tsx          ← layout shell, view switching, starfield
src/components/dashboard/
  DashboardNav.tsx                  ← NEW: logo, user menu, session
  DashboardStarfield.tsx            ← NEW: lightweight stars (client)
  DashboardCursor.tsx               ← NEW: reuse pattern from landing OR shared
  EmptyState.tsx                    ← REFACTOR: full-page first-time view
  OnboardingBanner.tsx              ← NEW: dismissible helper
  RepoSearch.tsx                    ← NEW: controlled search input
  RepoGrid.tsx                      ← minor: gap/columns match design
  RepoCard.tsx                      ← REFACTOR: variants + tilt client wrapper
```

Optional shared extraction later: move `DashboardCursor` / starfield logic next to `StarField.tsx` only if landing and dashboard should share one implementation.

---

## Data model

Update `RepoCardProps` in `RepoCard.tsx`:

```ts
export type RepoStatus = 'ready' | 'indexing' | 'not_indexed' | 'failed'

export interface RepoCardProps {
  title: string
  description: string
  language?: string
  languageColor?: string   // tailwind/dot color, e.g. '#3B82F6' for TS
  status: RepoStatus
  indexingProgress?: number  // 0–100, required when status === 'indexing'
  indexingDetail?: string    // e.g. 'Analyzing 143 files...'
  actionLabel?: 'Open' | 'Index Repo' | 'Retry'
  actionUrl?: string
  repoId?: string            // for /repo/[repoId] links
}
```

Map API/backend statuses to UI:

| Backend (future) | UI status |
|------------------|-----------|
| `INDEXED` | `ready` |
| `INDEXING` | `indexing` |
| `PENDING` / `NONE` | `not_indexed` |
| `ERROR` | `failed` |

---

## Implementation phases

### Phase 0 — Prerequisites

- [ ] Confirm `next-auth` session exposes `user.name`, `user.image` for nav avatar.
- [ ] Add `/settings` route stub if missing (design links Settings from dropdown).
- [ ] Decide view switch rule: `repos.length === 0` → empty state; else returning grid (hide connect banner on grid view).

### Phase 1 — Global styles (`src/app/globals.css`)

Add dashboard-specific utilities (namespaced to avoid landing regressions):

| Class | Purpose |
|-------|---------|
| `.cc-dashboard-glass` | Glass card: `rgba(17,17,24,0.6)`, blur 12px, hover lift `translateY(-4px) scale(1.02)`, indigo border glow |
| `.cc-dashboard-glass::before` | Mouse-tracking radial highlight via `--mouse-x`, `--mouse-y` |
| `.cc-dashboard-star-bg` | Fixed inset radial gradient background |
| `.cc-first-time-helper` | Left indigo border + horizontal gradient (helper banner) |
| `.cc-status-indexing` | Amber pulse ring (`pulse-yellow` keyframes from design) |
| `.cc-dashboard-scrollbar` | Optional: match design scrollbar colors |

Keep existing `.cc-glass` for landing; dashboard cards use `.cc-dashboard-glass` or extend `.cc-glass` carefully if behavior should match both pages.

### Phase 2 — Shell & layout (`page.tsx`)

1. Wrap page in `min-h-screen` with `bg-dark-bg` and mount `DashboardStarfield` + `DashboardCursor` (client components).
2. Replace inline header with `<DashboardNav />`.
3. **View logic:**
   ```tsx
   const hasRepos = repos.length > 0
   return hasRepos ? <ReturningDashboard ... /> : <EmptyState />
   ```
4. Remove simultaneous EmptyState + RepoGrid rendering.

### Phase 3 — `DashboardNav.tsx`

Match design structure:

- Logo: `8×8` rounded-lg `from-indigo to-cyan` gradient + `MapPin` icon (lucide).
- Brand text: “Codebase” (slate-100) + “ Cartographer” (cyan).
- Right: user button → hover dropdown (`glass-card` styles):
  - Avatar (`next/image` or `<img>` from session)
  - `@username` from session
  - Link to `/settings` with `Settings` icon
  - “Disconnect” → `signOut()` (red hover row)

Nav: `fixed top-0 w-full z-50`, `bg-[#0A0A0F]/80 backdrop-blur-xl`, border `#1E1E2E`, horizontal padding consistent with `max-w-7xl` content.

### Phase 4 — `EmptyState.tsx` (first-time)

Replace banner layout with design’s centered empty view:

- Blurred indigo/cyan orb behind card
- `48×48` (or `12rem`) bordered card with dot-grid background + bouncing `MapPin`
- Headline: `text-4xl` “Map your first codebase”
- Body copy + footnote “Works with public and private repos”
- Primary CTA: **“Choose a Repository”** → opens GitHub repo picker flow (or `signIn` + redirect to GitHub App install — wire to real flow when API exists)
- Do **not** show repo grid in this mode

Until repo-picker exists, CTA can call the same `signIn('github')` as today or open a modal placeholder.

### Phase 5 — Returning user chrome

**`OnboardingBanner.tsx`**

- Props: `onDismiss`, optional `storageKey` (`localStorage` to persist dismiss).
- Copy: “Select a repo to index it. Once indexed, you can ask the AI questions about it.”
- Sparkles icon + close button.

**`RepoSearch.tsx`**

- Controlled input, filters `repos` client-side by title/description.
- Styles: `pl-12`, search icon left, focus ring indigo (`search-input` behavior from design).

**Page header** in `page.tsx` or `ReturningDashboard.tsx`:

- `h1` `text-4xl font-bold` “Your Repositories”
- “New Repo” secondary button (`Plus` icon) — hook to add-repo flow (stub `onClick` OK for now).

### Phase 6 — `RepoCard.tsx` variants

Implement visual branches per status:

| Status | Icon box | Badge | Card shell | Footer |
|--------|----------|-------|------------|--------|
| `ready` | GitHub, indigo/10 | green “READY” | standard glass | lang dot + green Open |
| `indexing` | spinning `RefreshCw`, amber/10 | amber “INDEXING…” + pulse | standard glass | progress bar 65%, detail + % |
| `not_indexed` | `DatabaseBackup`, muted | gray “NOT INDEXED” | **dashed**, transparent | lang dot + indigo Index + `Zap` |
| `failed` | `AlertTriangle`, red/10 | red “FAILED” | red border + shadow | lang dot + red Retry |

**`RepoCardTilt.tsx`** (client wrapper): port `data-tilt` mousemove logic from design HTML; set `--mouse-x/y` on parent for `::before` gradient.

Use `Link` from `next/link` for Open → `/repo/[repoId]`.

### Phase 7 — `RepoGrid.tsx`

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Pass filtered repos from search state in parent.

### Phase 8 — Mock data & page wiring

Update `MOCK_REPOS` in `page.tsx` to exercise all four statuses (match design sample repos). Remove `indexed` / `unindexed` naming.

### Phase 9 — Auth & API (follow-up, not blocking UI)

- [ ] `GET /api/repos` → populate grid; drive empty vs returning view.
- [ ] Index action → `POST /api/repos/:id/index`.
- [ ] Session-required layout: redirect unauthenticated users to `/auth/login`.
- [ ] Wire “Disconnect” to `signOut({ callbackUrl: '/' })`.

---

## Files to touch (checklist)

| File | Action |
|------|--------|
| `.superdesign/dashboard-design.html` | Reference only (fetched) |
| `.superdesign/IMPLEMENTATION_PLAN-DASHBOARD.md` | This plan |
| `src/app/globals.css` | Add dashboard utilities + keyframes |
| `src/app/dashboard/page.tsx` | Shell, view switch, compose components |
| `src/components/dashboard/DashboardNav.tsx` | **Create** |
| `src/components/dashboard/DashboardStarfield.tsx` | **Create** |
| `src/components/dashboard/DashboardCursor.tsx` | **Create** (or share with landing) |
| `src/components/dashboard/OnboardingBanner.tsx` | **Create** |
| `src/components/dashboard/RepoSearch.tsx` | **Create** |
| `src/components/dashboard/EmptyState.tsx` | **Refactor** |
| `src/components/dashboard/RepoCard.tsx` | **Refactor** |
| `src/components/dashboard/RepoGrid.tsx` | **Update** grid classes |
| `.superdesign/init/pages.md` | Update dashboard dependency tree when done |
| `tailwind.config.ts` | Optional: add `dashboard-surface: #0A0A0F` if needed |

---

## Design decisions (intentional deltas)

| Design | Recommendation |
|--------|----------------|
| `iconify-icon` CDN | Use **`lucide-react`** — already installed, no CDN |
| Inter font | Keep **Geist** from root layout |
| `cursor: crosshair` | Use **`cursor: none`** + custom cursor (match landing) |
| Dicebear avatar URL | Use **session `user.image`** with fallback initials |
| Demo `toggleView()` JS | Replace with **real `repos.length` logic** |
| Preview URLs in draft | Replace with **`/repo/[id]`, `/settings`** |
| Heavy 3D tilt on mobile | Disable tilt below `md` breakpoint (performance) |

---

## Visual regression checklist

After implementation, verify at 1280px+ and 375px width:

- [ ] Unauthenticated users redirect to login (when middleware added).
- [ ] Zero repos: only empty state visible; no grid/header search.
- [ ] With repos: nav, banner, search, grid; no empty hero.
- [ ] Nav dropdown opens on hover/focus; Settings and Disconnect work.
- [ ] Starfield renders behind content; does not block clicks.
- [ ] Custom cursor follows pointer on dashboard only (or globally if desired).
- [ ] Each card status matches design colors and badges.
- [ ] Indexing card shows animated progress and pulse badge.
- [ ] Not-indexed card uses dashed border.
- [ ] Failed card shows red treatment + Retry.
- [ ] Open links navigate to repo explorer route.
- [ ] Search filters cards live.
- [ ] Helper banner dismisses and stays dismissed (localStorage).
- [ ] Hover: card lift, indigo border glow, spotlight follows mouse.
- [ ] No layout shift when scrolling (fixed nav padding `pt-24` on main).

---

## Suggested implementation order (single PR or stacked)

1. globals.css utilities  
2. `DashboardNav` + page shell + view switching  
3. `EmptyState` rewrite  
4. `RepoCard` status variants (no tilt yet)  
5. `OnboardingBanner` + `RepoSearch` + header/New Repo  
6. `DashboardStarfield` + `DashboardCursor`  
7. `RepoCardTilt` client wrapper  
8. Mock data + polish + update `pages.md`  

---

## Related designs in project

The draft links preview URLs for **Settings** and **repo explorer / index flows**. Implement dashboard first; use `superdesign get-design` on those draft IDs when ready to plan `/settings` and `/repo/[repoId]`.

Previous plan for the **landing page** remains in [`.superdesign/IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) (draft `72ecde5d-bc44-49e3-bd6f-1998197bd07b`).
