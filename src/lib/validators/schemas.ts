import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().optional().or(z.literal('')),
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  is_current: z.boolean(),
  description: z.string().optional().or(z.literal('')),
})

export const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().optional().or(z.literal('')),
  field_of_study: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  gpa: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['technical', 'soft']),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().or(z.literal('')),
  technologies: z.array(z.string()),
  live_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  repo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const tailorSchema = z.object({
  job_description: z.string().min(50, 'Job description must be at least 50 characters'),
  job_title: z.string().optional().or(z.literal('')),
  company_name: z.string().optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type ExperienceFormData = z.infer<typeof experienceSchema>
export type EducationFormData = z.infer<typeof educationSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type TailorFormData = z.infer<typeof tailorSchema>
