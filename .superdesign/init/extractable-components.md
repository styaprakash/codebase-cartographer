# Extractable Components

## Layout Components (appear on most pages)

No layout components exist yet (no NavBar, Sidebar, Header, Footer).

## Basic Components (used across pages)

No shared UI primitives exist yet (no Button, Card, Input, etc.).

The only reusable pieces are:

### GitHubButton
- Source: `src/components/landing/GitHubButton.tsx`
- Category: basic
- Description: GitHub OAuth CTA button with icon
- Extractable props: none (self-contained, no props)
- Hardcoded: GitHub SVG icon, "Continue with GitHub" label, all CSS classes

### FeatureCards
- Source: `src/components/landing/FeatureCards.tsx`
- Category: basic
- Description: 3-column grid of glassmorphism feature cards
- Not extractable as DraftComponent — data-driven via FEATURES array
