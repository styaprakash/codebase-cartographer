# Codebase Cartographer — Design System

## Product Context
AI-powered code understanding tool. Users connect GitHub repos, AI indexes the code, and they can ask questions in plain English.

## Core Pages
- **Landing** (`/`): Dark space theme with Earth animation, star field, feature cards
- **Login** (`/auth/login`): Centered GitHub OAuth button
- **Indexing** (`/indexing/[repoId]`): Progress overlay while AI indexes a repo
- **Dashboard** (`/dashboard`): Grid of repo cards with search (TODO)
- **Repo Explorer** (`/repo/[repoId]`): File tree, chat, dependency map (TODO)
- **Settings** (`/settings`): User preferences (TODO)

## Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--indigo` | `#6366F1` | Primary brand, buttons, links |
| `--indigo-light` | `#EEEDFE` | Light indigo backgrounds |
| `--cyan` | `#06B6D4` | Accent, progress bars, status |
| `--green` | `#10B981` | Success, ready status |
| `--amber` | `#EF9F27` | Warning, indexing status |
| `--red` | `#EF4444` | Error, destructive actions |

## Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0A0A0F` | Page background |
| `--bg-surface` | `#0D0D1A` | Cards, panels |
| `--bg-elevated` | `#111124` | Modals, dropdowns |

## Borders
| Token | Hex |
|-------|-----|
| `--border` | `#1E1E2E` |
| `--border-active` | `#6366F1` |

## Text
| Token | Hex |
|-------|-----|
| `--text-primary` | `#F1F5F9` |
| `--text-secondary` | `#94A3B8` |
| `--text-muted` | `#64748B` |

## Fonts
- **Sans**: Geist Sans (`--font-geist-sans`)
- **Mono**: Geist Mono (`--font-geist-mono`)

## Spacing
Based on `0.25rem` base unit. Common gaps: `0.75rem` (3), `1rem` (4), `1.5rem` (6), `2.5rem` (10).

## Border Radius
- `--radius-xl`: 12px (cards)
- `--radius-2xl`: 16px (modals)
- `--radius-3xl`: 24px (large cards)
- rounded-full: 9999px (progress bars, pills)

## Shadows
- `--shadow-glow-indigo`: `0 0 20px rgba(99, 102, 241, 0.3)`
- `--shadow-glow-cyan`: `0 0 20px rgba(6, 182, 212, 0.3)`
- Card shadow: `0 0 40px rgba(0, 0, 0, 0.5)` (indexing card)

## Glass Card Pattern
```css
.glass-container {
    background: rgba(17, 17, 24, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid #1E1E2E;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}
```

## Progress Bar Pattern
```css
.progress-bar-fill {
    background: linear-gradient(90deg, #6366F1 0%, #06B6D4 100%);
    border-radius: 9999px;
}
.progress-glow {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: #06B6D4;
    filter: blur(20px);
    opacity: 0.6;
}
```

## Animations
- `progressPulse`: Opacity pulse for progress bar active state
- `spin`: 360 degree rotation for loading spinners
- `pulse`: Tailwind's opacity pulse for status indicators
- `cc-pulse-dot`: Scale + opacity pulse for badge dots

## Indexing Page Structure
1. **Animated code background**: Fixed, z-0, scrolling code snippet with `opacity-[0.08] blur-[3px]`
2. **Header**: GitHub icon + repo name + external link
3. **Glass card** (max-width 42rem):
   - "Current Phase" label + phase text + percentage
   - Progress bar with gradient fill
   - File count + "AI Mapping Active" status
   - Phase checklist with 3 items (check ✓, spinner ⟳, pending ○)
4. **Footer**: "This usually takes around 1-2 minutes" hint text
5. **Failed state**: Error card with retry + back actions

## Phase States
- **Done**: CheckCircle icon (`#10B981`, weight 500 text)
- **Active**: Loader2 spinner (`#6366F1`, weight 400 text)
- **Pending**: Empty circle border (`#2D2D3F`, weight 400 text `#475569`)
