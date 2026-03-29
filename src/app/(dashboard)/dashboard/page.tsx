
import ResumeList from '@/components/dashboard/ResumeList'
import { getTailoredResumes } from '@/services/resumes/queries'

export default async function DashboardPage() {
  const resumes = await getTailoredResumes()

  return <ResumeList resumes={resumes} />
}
