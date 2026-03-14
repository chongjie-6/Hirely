import type { Profile, Experience, Education, Skill, Project } from '@/types/database'
import { formatDateRange } from '@/lib/utils'

export const SYSTEM_PROMPT = `You are a professional resume tailoring expert. Your job is to take a candidate's existing resume data and tailor it to match a specific job description.

Rules:
1. NEVER fabricate experience, skills, or qualifications the candidate does not have.
2. Reword experience bullet points to emphasize relevant skills and achievements that match the job description. Use strong action verbs and quantify results where the original data supports it.
3. Reorder skills to place the most relevant ones first.
4. Reorder projects to place the most relevant ones first.
5. Generate a tailored professional summary (2-3 sentences) based on the job description that positions the candidate for this specific role. The summary should highlight the candidate's most relevant qualifications and experience as they relate to what the job is looking for. Do NOT simply reuse the candidate's existing summary — write a new one specifically targeted at this job.
6. Suggest an optimal section ordering based on what the job values most.
7. Provide a match score (0-100) indicating how well the candidate's background aligns with the job requirements.
8. Provide 2-4 actionable suggestions for how the candidate could strengthen their application.
9. Keep all education entries unchanged but reorder by relevance if applicable.

Respond ONLY with valid JSON matching this exact schema:
{
  "tailoredContent": {
    "summary": "string - tailored professional summary",
    "experiences": [
      {
        "id": "original-uuid",
        "company": "string",
        "title": "string",
        "start_date": "string or null",
        "end_date": "string or null",
        "is_current": boolean,
        "description": "string - tailored bullet points"
      }
    ],
    "skills": {
      "technical": ["string - ordered by relevance"],
      "soft": ["string - ordered by relevance"]
    },
    "projects": [
      {
        "id": "original-uuid",
        "name": "string",
        "description": "string - tailored description",
        "technologies": ["string"],
        "live_url": "string or null",
        "repo_url": "string or null"
      }
    ],
    "education": [
      {
        "id": "original-uuid",
        "school": "string",
        "degree": "string or null",
        "field_of_study": "string or null",
        "start_date": "string or null",
        "end_date": "string or null",
        "gpa": "string or null",
        "description": "string or null"
      }
    ],
    "sectionOrder": ["summary", "experience", "skills", "projects", "education"],
    "suggestions": ["string"]
  },
  "matchScore": 75
}`

export function buildUserMessage(
  jobDescription: string,
  profile: Profile,
  experiences: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[]
): string {
  const technicalSkills = skills.filter(s => s.category === 'technical').map(s => s.name)
  const softSkills = skills.filter(s => s.category === 'soft').map(s => s.name)

  let message = `## Job Description\n${jobDescription}\n\n## Candidate Resume Data\n\n`

  message += `### Personal Info\n`
  message += `Name: ${profile.full_name || 'Not provided'}\n`
  if (profile.summary) message += `Current Summary: ${profile.summary}\n`
  message += '\n'

  if (experiences.length > 0) {
    message += `### Work Experience\n`
    for (const exp of experiences) {
      message += `**${exp.title}** at **${exp.company}** (${formatDateRange(exp.start_date, exp.end_date, exp.is_current)})\n`
      message += `ID: ${exp.id}\n`
      if (exp.description) message += `${exp.description}\n`
      message += '\n'
    }
  }

  if (education.length > 0) {
    message += `### Education\n`
    for (const edu of education) {
      message += `**${edu.degree || ''} ${edu.field_of_study ? `in ${edu.field_of_study}` : ''}** at **${edu.school}** (${formatDateRange(edu.start_date, edu.end_date)})\n`
      message += `ID: ${edu.id}\n`
      if (edu.gpa) message += `GPA: ${edu.gpa}\n`
      if (edu.description) message += `${edu.description}\n`
      message += '\n'
    }
  }

  if (technicalSkills.length > 0 || softSkills.length > 0) {
    message += `### Skills\n`
    if (technicalSkills.length > 0) message += `Technical: ${technicalSkills.join(', ')}\n`
    if (softSkills.length > 0) message += `Soft: ${softSkills.join(', ')}\n`
    message += '\n'
  }

  if (projects.length > 0) {
    message += `### Projects\n`
    for (const proj of projects) {
      message += `**${proj.name}**\n`
      message += `ID: ${proj.id}\n`
      if (proj.description) message += `${proj.description}\n`
      if (proj.technologies?.length > 0) message += `Technologies: ${proj.technologies.join(', ')}\n`
      if (proj.live_url) message += `Live: ${proj.live_url}\n`
      if (proj.repo_url) message += `Repo: ${proj.repo_url}\n`
      message += '\n'
    }
  }

  return message
}
