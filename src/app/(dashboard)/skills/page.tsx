import { getSkills } from '@/services/queries'
import SkillsList from '@/components/skills/skills-form'

export default async function SkillsPage() {
  const skills = await getSkills()

  return <SkillsList skills={skills} />
}
