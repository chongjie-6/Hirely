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

- **Mutations** → `src/services/actions.ts` (`"use server"` Server Actions)
- **Reads** → `src/services/queries.ts` (cached with `unstable_cache` + revalidation tags)
- **Clients** → `src/services/supabase/server.ts` (Server Components/Actions), `src/services/supabase/client.ts` (Client Components)

All tables (`profiles`, `experiences`, `education`, `skills`, `projects`, `tailored_resumes`, `applications`) have Row-Level Security enabled — user data is isolated by `user_id`.

### AI Integration

The core feature lives in `src/services/actions.ts::tailorResume()`:
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
