import Link from 'next/link'

import ResumePreviewClient from '@/components/resume/resume-preview-page'
import { getTailoredResume } from '@/services/resumes/queries'
import { getProfile } from '@/services/profile/queries'
import { getExperiences } from '@/services/experiences/queries'
import { getEducation } from '@/services/education/queries'
import { getSkills } from '@/services/skills/queries'
import { getProjects } from '@/services/projects/queries'

export default async function ResumePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [resume, profile, experiences, education, skills, projects] = await Promise.all([
    getTailoredResume(id),
    getProfile(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getProjects(),
  ])

  if (!resume || !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Resume not found.</p>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <ResumePreviewClient
      resume={resume}
      profile={profile}
      originalData={{
        summary: profile.summary,
        experiences,
        education,
        skills,
        projects,
      }}
    />
  )
}
