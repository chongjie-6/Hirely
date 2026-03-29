
import SkillsList from '@/components/skills/skills-form'
import { getSkills } from '@/services/skills/queries'

export default async function SkillsPage() {
  const skills = await getSkills()

  return <SkillsList skills={skills} />
}
