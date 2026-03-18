export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  summary: string | null
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  title: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  user_id: string
  school: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  gpa: string | null
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: 'technical' | 'soft'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  technologies: string[]
  live_url: string | null
  repo_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface OriginalResumeData {
  summary: string | null
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
}

export interface TailoredResume {
  id: string
  user_id: string
  job_title: string | null
  company_name: string | null
  job_description: string
  tailored_content: TailoredContent
  match_score: number | null
  created_at: string
}

export interface TailoredContent {
  summary: string
  experiences: TailoredExperience[]
  skills: {
    technical: string[]
    soft: string[]
  }
  projects: TailoredProject[]
  education: TailoredEducation[]
  sectionOrder: string[]
  suggestions: string[]
  coverLetter?: string
}

export interface TailoredExperience {
  id: string
  company: string
  title: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string
}

export interface TailoredProject {
  id: string
  name: string
  description: string
  technologies: string[]
  live_url: string | null
  repo_url: string | null
}

export interface TailoredEducation {
  id: string
  school: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  gpa: string | null
  description: string | null
}
