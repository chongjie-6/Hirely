import { getEducation } from '@/services/queries'
import EducationList from '@/components/education/education-form'

export default async function EducationPage() {
  const education = await getEducation()

  return <EducationList education={education} />
}
