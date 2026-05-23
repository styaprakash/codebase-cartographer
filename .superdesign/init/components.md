# UI Components (shared primitives)

**Note**: This project has NO shared UI primitives library. The `src/components/ui/` directory is empty. No shadcn/ui, MUI, or any other component library is used. All styling is done via Tailwind utility classes, CSS variables from `globals.css`, and custom CSS utility classes (`.cc-glass`, `.cc-cta`, etc.).

The only shared utility class file is `src/app/globals.css` which defines utility classes like `.cc-glass`, `.cc-progress-fill`, `.cc-dot-pulse`, `.cc-skeleton`, `.cc-cursor`, `.cc-cta`.

Components are page-specific and located in feature folders under `src/components/`.
