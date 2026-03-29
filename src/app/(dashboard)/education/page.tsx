
import EducationList from '@/components/education/EducationForm'
import { getEducation } from '@/services/education/queries'

export default async function EducationPage() {
  const education = await getEducation()

  return <EducationList education={education} />
}
