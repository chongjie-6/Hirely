-- ============================================
-- Hirely Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- PROFILES
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  portfolio_url text,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = user_id);

-- EXPERIENCES
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  title text not null,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.experiences enable row level security;
create policy "Users can view own experiences" on public.experiences for select using (auth.uid() = user_id);
create policy "Users can insert own experiences" on public.experiences for insert with check (auth.uid() = user_id);
create policy "Users can update own experiences" on public.experiences for update using (auth.uid() = user_id);
create policy "Users can delete own experiences" on public.experiences for delete using (auth.uid() = user_id);

-- EDUCATION
create table public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  gpa text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.education enable row level security;
create policy "Users can view own education" on public.education for select using (auth.uid() = user_id);
create policy "Users can insert own education" on public.education for insert with check (auth.uid() = user_id);
create policy "Users can update own education" on public.education for update using (auth.uid() = user_id);
create policy "Users can delete own education" on public.education for delete using (auth.uid() = user_id);

-- SKILLS
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'technical',
  created_at timestamptz default now()
);

alter table public.skills enable row level security;
create policy "Users can view own skills" on public.skills for select using (auth.uid() = user_id);
create policy "Users can insert own skills" on public.skills for insert with check (auth.uid() = user_id);
create policy "Users can update own skills" on public.skills for update using (auth.uid() = user_id);
create policy "Users can delete own skills" on public.skills for delete using (auth.uid() = user_id);

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  technologies text[] default '{}',
  live_url text,
  repo_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

-- TAILORED RESUMES
create table public.tailored_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text,
  company_name text,
  job_description text not null,
  tailored_content jsonb not null,
  match_score int,
  created_at timestamptz default now()
);

alter table public.tailored_resumes enable row level security;
create policy "Users can view own resumes" on public.tailored_resumes for select using (auth.uid() = user_id);
create policy "Users can insert own resumes" on public.tailored_resumes for insert with check (auth.uid() = user_id);
create policy "Users can update own resumes" on public.tailored_resumes for update using (auth.uid() = user_id);
create policy "Users can delete own resumes" on public.tailored_resumes for delete using (auth.uid() = user_id);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- INDEXES
create index idx_experiences_user_id on public.experiences(user_id);
create index idx_education_user_id on public.education(user_id);
create index idx_skills_user_id on public.skills(user_id);
create index idx_projects_user_id on public.projects(user_id);
create index idx_tailored_resumes_user_id on public.tailored_resumes(user_id);
