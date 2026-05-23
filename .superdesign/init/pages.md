# Page Dependency Trees

## `/` — Landing Page
Entry: `src/app/page.tsx`
Dependencies:
- `src/app/layout.tsx`
  - `src/app/globals.css`
  - `tailwind.config.ts`
- `src/components/landing/StarField.tsx`
- `src/components/landing/Earth.tsx`
- `src/components/landing/FeatureCards.tsx`
  - lucide-react (GitBranch, Sparkles, Network)
- `src/components/landing/GitHubButton.tsx`
  - next-auth/react (signIn)

## `/auth/login` — Login Page
Entry: `src/app/auth/login/page.tsx`
Dependencies:
- `src/app/layout.tsx`
  - `src/app/globals.css`
- `src/components/landing/GitHubButton.tsx`
  - next-auth/react (signIn)

## `/dashboard` — Dashboard Page
Entry: `src/app/dashboard/page.tsx`
Dependencies:
- `src/app/layout.tsx`
  - `src/app/globals.css`
**File is empty (TODO)**

## `/repo/[repoId]` — Repo Explorer
Entry: N/A (route file does not exist yet)
Todo components (all empty files):
- `src/components/explorer/FileTree.tsx`
- `src/components/explorer/ChatPanel.tsx`
- `src/components/explorer/DependencyMap.tsx`
- `src/components/explorer/DetailsPanel.tsx`
- `src/components/indexing/IndexingOverlay.tsx`
- `src/components/dashboard/RepoGrid.tsx`
- `src/components/dashboard/RepoCard.tsx`
- `src/components/dashboard/EmptyState.tsx`
- `src/components/settings/SettingsPage.tsx`
