
import SkillsList from '@/components/skills/SkillsForm'
import { getSkills } from '@/services/skills/queries'

export default async function SkillsPage() {
  const skills = await getSkills()

  return <SkillsList skills={skills} />
}
