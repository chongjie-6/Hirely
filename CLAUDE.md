# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build with Turbopack
npm run start      # Start production server
npm run lint       # Run ESLint
```

No test suite is currently configured.

## Architecture

**Hirely** is an AI-powered resume tailoring app built with Next.js 16 App Router. Users store their resume data once, then paste any job description to get a Claude-tailored resume with a match score. Key features: PDF export, resume diff viewer, cover letter generation, and a Kanban-style job application tracker.

### Route Groups

- `src/app/(auth)/` — Public: `/login`, `/signup`, `/auth/callback`
- `src/app/(dashboard)/` — Protected routes behind Supabase auth middleware

### Data Layer

**No ORM.** Direct Supabase client queries throughout.

Each domain has its own service folder under `src/services/`:

| Domain | Actions | Queries |
|---|---|---|
| `resumes` | `src/services/resumes/action.ts` | `src/services/resumes/queries.ts` |
| `applications` | `src/services/applications/actions.ts` | `src/services/applications/queries.ts` |
| `experiences` | `src/services/experiences/actions.ts` | `src/services/experiences/queries.ts` |
| `education` | `src/services/education/actions.ts` | `src/services/education/queries.ts` |
| `skills` | `src/services/skills/action.ts` | `src/services/skills/queries.ts` |
| `projects` | `src/services/projects/action.ts` | `src/services/projects/queries.ts` |
| `profile` | `src/services/profile/actions.ts` | `src/services/profile/queries.ts` |
| `user` | `src/services/user/actions.ts` | `src/services/user/queries.ts` |

- **Actions** — `"use server"` Server Actions (mutations)
- **Queries** — cached reads with `unstable_cache` + revalidation tags
- **Clients** → `src/services/supabase/server.ts` (Server Components/Actions), `src/services/supabase/client.ts` (Client Components)

When adding new server mutations or reads, place them in the relevant domain service folder. Create a new domain folder if needed, following the same `actions.ts` / `queries.ts` pattern.

All tables (`profiles`, `experiences`, `education`, `skills`, `projects`, `tailored_resumes`, `applications`) have Row-Level Security enabled — user data is isolated by `user_id`.

### Naming Conventions

- **Components** — PascalCase filenames and function names (e.g., `ResumeCard.tsx`, `JobApplicationBoard.tsx`). This applies to all files under `src/components/` and page/layout files under `src/app/`.
- **Services** — camelCase function names within action/query files (e.g., `tailorResume`, `getApplications`).
- **Utilities / lib** — camelCase filenames (e.g., `src/lib/diff.ts`, `src/lib/utils.ts`).

### AI Integration

The core feature lives in `src/services/resumes/action.ts::tailorResume()`:
1. Fetches all user resume data
2. Calls Claude Haiku (`claude-haiku-4-5-20251001`) via `src/lib/claude/client.ts` singleton
3. System prompt in `src/lib/claude/prompts.ts` — outputs structured JSON (tailored bullet points, match score 0–100, suggestions)
4. Saves to `tailored_resumes` table as JSONB, redirects to `/resume/[id]`

Cover letter is optional; increases max tokens from 4096 → 8192.

### Authentication

Supabase Auth with email/password + Google OAuth. Session refresh runs in `middleware.ts` on every request. OAuth PKCE flow handled at `/app/(auth)/auth/callback/route.ts`.

### Key Libraries

- **UI**: shadcn/ui (Base Nova theme, `components.json`), Tailwind CSS 4, lucide-react
- **Forms**: react-hook-form + zod (`src/lib/validators/schemas.ts`)
- **PDF**: `@react-pdf/renderer` — transpiled via `next.config.ts`
- **Drag-and-drop**: `@dnd-kit` (experience, education, projects ordering)
- **Diff viewer**: `src/lib/diff.ts` + `src/components/resume/ResumeDiff.tsx`

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

### Database Migrations

SQL migrations are in `supabase/migrations/`. Run with the Supabase CLI (`supabase db push` or `supabase migration up`). Types are manually maintained in `src/types/database.ts`.
