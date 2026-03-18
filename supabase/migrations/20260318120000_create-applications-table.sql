-- APPLICATIONS (Job Application Tracker)
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text not null,
  company_name text not null,
  status text not null default 'applied' check (status in ('applied', 'phone_screen', 'interview', 'offer', 'rejected')),
  applied_date date default now(),
  notes text,
  url text,
  salary text,
  contact_name text,
  contact_email text,
  tailored_resume_id uuid references public.tailored_resumes(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.applications enable row level security;
create policy "Users can view own applications" on public.applications for select using (auth.uid() = user_id);
create policy "Users can insert own applications" on public.applications for insert with check (auth.uid() = user_id);
create policy "Users can update own applications" on public.applications for update using (auth.uid() = user_id);
create policy "Users can delete own applications" on public.applications for delete using (auth.uid() = user_id);

create index idx_applications_user_id on public.applications(user_id);
create index idx_applications_user_status on public.applications(user_id, status);
