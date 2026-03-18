import { unstable_cache } from 'next/cache'
import { createClient } from '@/services/supabase/server'
import type { Profile, Experience, Education, Skill, Project, TailoredResume, ApplicationWithResume } from '@/types/database'

async function getSupabaseAndUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, userId: user.id }
}

export async function getProfile(): Promise<Profile | null> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      return data
    },
    [`profile-${userId}`],
    { tags: ['profile'] }
  )()
}

export async function getExperiences(): Promise<Experience[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })
      return data ?? []
    },
    [`experiences-${userId}`],
    { tags: ['experiences'] }
  )()
}

export async function getEducation(): Promise<Education[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })
      return data ?? []
    },
    [`education-${userId}`],
    { tags: ['education'] }
  )()
}

export async function getSkills(): Promise<Skill[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      return data ?? []
    },
    [`skills-${userId}`],
    { tags: ['skills'] }
  )()
}

export async function getProjects(): Promise<Project[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })
      return data ?? []
    },
    [`projects-${userId}`],
    { tags: ['projects'] }
  )()
}

export async function getTailoredResumes(): Promise<TailoredResume[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('tailored_resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [`resumes-${userId}`],
    { tags: ['resumes'] }
  )()
}

export async function getTailoredResume(id: string): Promise<TailoredResume | null> {
  const { supabase } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('tailored_resumes')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      return data as TailoredResume | null
    },
    [`resume-${id}`],
    { tags: ['resumes', `resume-${id}`] }
  )()
}

export async function getApplicationsWithResumes(): Promise<ApplicationWithResume[]> {
  const { supabase, userId } = await getSupabaseAndUserId()
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('applications')
        .select('*, tailored_resume:tailored_resumes(id, job_title, company_name, match_score)')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })
      return (data ?? []) as ApplicationWithResume[]
    },
    [`applications-${userId}`],
    { tags: ['applications'] }
  )()
}
