# Implementation Plan: Compressed Space Observatory Landing

> **Design fetched from SuperDesign** (draft: `72ecde5d-bc44-49e3-bd6f-1998197bd07b`, project: `76453478-688f-42ae-b473-d156395da9e9`)

## Design Overview

The "Compressed Space Observatory" design is a refined version of the existing Codebase Cartographer landing page. It retains the same space-themed aesthetic (dark background `#050510`, rotating Earth, interactive stars, parallax) but introduces several refinements.

## 🔍 Current vs. Design Comparison

| Aspect | Current Implementation | Design Difference |
|--------|----------------------|-------------------|
| **Custom Cursor** | CSS-only via `.cc-cursor` class | Always-visible inline element with JS tracking |
| **Star Parallax** | v1: `-30px` translate via container transform | v2: `-15px` translate per star layer (gentler) |
| **Earth Parallax** | `-80px` translate | `-40px` translate (gentler) |
| **Earth Atmosphere** | Separate `<div>` with radial-gradient | Same, but adds `::after` lens flare pseudo-element |
| **Earth Land Masses** | 6 radial-gradients + linear-gradient | 8 radial-gradients + linear-gradient (richer) |
| **Icon Library** | `lucide-react` components | `iconify-icon` web component (CDN loaded) |
| **CTA** | `<button>` with `signIn('github')` | `<a href="#dashboard">` link (placeholder) |
| **Glow Shadow** | `box-shadow: 0 0 20px` | Same, but 0.3 opacity |
| **Earth Surface Glow** | Precomputed gradients | Adds explicit `::before` highlight layer |
| **Glass Card** | `backdrop-filter: blur(12px)` | `backdrop-filter: blur(10px)` (slightly less blur) |

## 📋 Changes to Implement

### 1. Enhance Earth Component (`src/components/landing/Earth.tsx`)

- **Lens flare**: Add the `::after`-style lens flare effect to the earth wrapper (the bright white spot at top-right that pulses)
  - Position: top-right, width 15%, height 15%
  - Radial gradient from white to transparent
  - Filter: blur(8px)
  - Animation: `cc-lens-flare` 3s ease-in-out infinite (already exists in globals.css)

- **Surface highlight**: Add `::before`-style specular highlight to the earth surface
  - Radial gradient with white at 0.15 opacity across diagonal
  - Gives the globe a 3D spherical sheen

- **Richer land masses**: Add 2 additional radial gradients to the surface background:
  ```
  radial-gradient(circle at 50% 90%, #0a4a5c 0%, transparent 14%)
  ```
  for a landmass at the bottom

- **Reduce parallax intensity**: Change earth parallax from `-80px` to `-40px` for gentler movement

### 2. Adjust Star Parallax (`src/components/landing/StarField.tsx`)

- Reduce star parallax from `-30px` to `-15px` (design calls for gentler parallax where stars move less than earth)
- Keep the same shake logic (no change needed — the 120px radius shake is already correct)

### 3. Custom Cursor Refinement

The design always shows the cursor (currently it's CSS-only and relies on `cursor: none` on the parent). No change needed if current behavior is acceptable — the CSS-only approach works fine since `cursor: none` is set on the `<main>` element.

### 4. FeatureCards — Icon Library (Optional)

The design uses `iconify-icon` web components instead of `lucide-react`. This is a tradeoff:
- **Stick with `lucide-react`**: Already installed, bundle-friendly, tree-shakeable
- **Switch to `iconify-icon`**: More icon choices, but adds CDN dependency

**Recommendation**: Keep `lucide-react` — icons are identical in appearance and lucide is already a dependency.

### 5. CTA Button

No changes needed — the current `GitHubButton.tsx` already handles the `signIn('github')` flow properly (the design's `<a href="#dashboard">` is just a placeholder).

## 📐 Visual Regression Checklist

After implementing changes, verify:

- [ ] Earth has pulsing lens flare at top-right
- [ ] Earth surface has specular highlight sheen
- [ ] Earth land masses look richer (8 vs 6 gradient spots)
- [ ] Parallax is gentler (stars move less than earth)
- [ ] Atmosphere glow still shows correctly
- [ ] All animations play (rotate-earth, drift-clouds, lens-flare, shake)
- [ ] Glass cards have correct backdrop blur on hover
- [ ] Cursor hides on the main element
- [ ] Page is responsive at desktop widths

## ⏭️ Future Pages (from the wider design project)

The full project contains additional pages beyond the landing page. See `.superdesign/init/pages.md` for the dependency trees of dashboard, explorer, and settings pages.

**Dashboard:** Design fetched and planned in [`.superdesign/IMPLEMENTATION_PLAN-DASHBOARD.md`](./IMPLEMENTATION_PLAN-DASHBOARD.md) (draft `27810115-ea71-408f-98fb-2d490e18f046`).
