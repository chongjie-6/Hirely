import { getExperiences } from '@/services/queries'
import ExperienceList from '@/components/experience/experience-form'

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return <ExperienceList experiences={experiences} />
}
