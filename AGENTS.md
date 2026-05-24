# AGENTS.md

## General Rules

- Always use TypeScript
- Prefer clean, modular, production-grade code
- Avoid using `any`
- Reuse existing utilities/components before creating new ones
- Keep files small and maintainable
- Use async/await instead of promise chains
- Follow existing project structure and naming conventions

---

## Frontend Rules

- Use Next.js App Router
- Prefer Server Components unless interactivity is needed
- Use TailwindCSS for styling
- Keep business logic outside UI components
- Use reusable hooks/services for API calls

---

## Backend Rules

- Keep controllers thin
- Put business logic inside services
- Use DTOs/types for request validation
- Handle errors properly with meaningful messages

---

## Authentication Rules

- Use NextAuth for OAuth session management
- Use backend JWT for API authorization
- Never expose secrets/tokens in logs
- GitHub OAuth is only for identity verification

---

## Architecture Rules

- Frontend handles UI/state
- Backend handles business logic/auth/database
- Keep API layer separated from components
- Prefer scalable folder structures

---

## AI Agent Instructions

Always read and follow:
- `.cursor/rules/**`
- `.antigravity/**`

Treat them as project source-of-truth guides.