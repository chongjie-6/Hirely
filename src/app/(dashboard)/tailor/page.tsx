import TailorForm from '@/components/tailor/tailor-form'
import { getEducation } from '@/services/education/queries'
import { getExperiences } from '@/services/experiences/queries'
import { getProfile } from '@/services/profile/queries'
import { getProjects } from '@/services/projects/queries'
import { getSkills } from '@/services/skills/queries'

export default async function TailorPage() {
  const [profile, experiences, education, skills, projects] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducation(),
    getSkills(),
    getProjects(),
  ])

  const summary = {
    hasProfile: !!profile?.full_name,
    experienceCount: experiences.length,
    educationCount: education.length,
    skillsCount: skills.length,
    projectsCount: projects.length,
    hasMinimumData: !!profile?.full_name && (experiences.length > 0 || skills.length > 0),
  }

  return <TailorForm summary={summary} />
}
