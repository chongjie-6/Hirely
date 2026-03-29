
import ExperienceList from '@/components/experience/ExperienceForm'
import { getExperiences } from '@/services/experiences/queries'

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return <ExperienceList experiences={experiences} />
}
