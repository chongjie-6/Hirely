# Hirely

AI-powered resume tailoring app. Enter your experience once, paste any job description, and get a tailored resume in seconds.

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth + PostgreSQL)
- **Claude API** (Anthropic SDK)
- **Tailwind CSS**
- **@react-pdf/renderer** (PDF export)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Providers** and enable Google OAuth (optional)
4. Copy your project URL and anon key from **Settings > API**

### 3. Configure environment variables

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Email/password + Google OAuth authentication
- Resume data management (profile, experience, education, skills, projects)
- AI-powered resume tailoring via Claude API
- Match score showing alignment with job requirements
- In-browser resume preview
- ATS-friendly PDF export
- Actionable suggestions for strengthening applications
