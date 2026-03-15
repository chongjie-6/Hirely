'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/services/supabase/server'
import { getAnthropicClient } from '@/lib/claude/client'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/claude/prompts'
import type { Profile } from '@/types/database'

async function getCurrentUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

// --- Profile ---

export async function updateProfile(updates: Partial<Profile>) {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  updateTag('profile')
  return data
}

// --- Experiences ---

export async function addExperience(exp: Record<string, unknown>) {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('experiences')
    .insert({ ...exp, user_id: userId })
    .select()
    .single()

  if (error) throw error
  updateTag('experiences')
  return data
}

export async function updateExperience(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('experiences')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  updateTag('experiences')
  return data
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('experiences').delete().eq('id', id)
  if (error) throw error
  updateTag('experiences')
}

// --- Education ---

export async function addEducation(edu: Record<string, unknown>) {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('education')
    .insert({ ...edu, user_id: userId })
    .select()
    .single()

  if (error) throw error
  updateTag('education')
  return data
}

export async function updateEducation(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('education')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  updateTag('education')
  return data
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) throw error
  updateTag('education')
}

// --- Skills ---

export async function addSkill(skill: { name: string; category: 'technical' | 'soft' }) {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('skills')
    .insert({ ...skill, user_id: userId })
    .select()
    .single()

  if (error) throw error
  updateTag('skills')
  return data
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
  updateTag('skills')
}

// --- Projects ---

export async function addProject(project: Record<string, unknown>) {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...project, user_id: userId })
    .select()
    .single()

  if (error) throw error
  updateTag('projects')
  return data
}

export async function updateProject(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  updateTag('projects')
  return data
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  updateTag('projects')
}

// --- Tailored Resumes ---

export async function deleteResume(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('tailored_resumes').delete().eq('id', id)
  if (error) throw error
  updateTag('resumes')
}

export async function tailorResume(input: {
  job_description: string
  job_title?: string
  company_name?: string
}): Promise<{ id: string }> {
  const { job_description, job_title, company_name } = input

  if (!job_description || job_description.length < 50) {
    throw new Error('Job description must be at least 50 characters')
  }

  const userId = await getCurrentUserId()
  const supabase = await createClient()

  // Fetch all user resume data in parallel
  const [profileRes, experiencesRes, educationRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', userId).single(),
    supabase.from('experiences').select('*').eq('user_id', userId).order('sort_order'),
    supabase.from('education').select('*').eq('user_id', userId).order('sort_order'),
    supabase.from('skills').select('*').eq('user_id', userId),
    supabase.from('projects').select('*').eq('user_id', userId).order('sort_order'),
  ])

  if (!profileRes.data) {
    throw new Error('Profile not found')
  }

  const userMessage = buildUserMessage(
    job_description,
    profileRes.data,
    experiencesRes.data ?? [],
    educationRes.data ?? [],
    skillsRes.data ?? [],
    projectsRes.data ?? []
  )

  // Call Claude API
  const anthropic = getAnthropicClient()
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  // Extract text content from response
  const textBlock = response.content.find(block => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No response from AI')
  }

  // Parse the JSON response
  let parsed
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('Failed to parse AI response')
  }

  // Save to database
  const { data: savedResume, error: saveError } = await supabase
    .from('tailored_resumes')
    .insert({
      user_id: userId,
      job_title: job_title || null,
      company_name: company_name || null,
      job_description,
      tailored_content: parsed.tailoredContent,
      match_score: parsed.matchScore,
    })
    .select()
    .single()

  if (saveError) throw saveError

  updateTag('resumes')

  return { id: savedResume.id }
}
