
import ResumeList from '@/components/dashboard/resume-list'
import { getTailoredResumes } from '@/services/resumes/queries'

export default async function DashboardPage() {
  const resumes = await getTailoredResumes()

  return <ResumeList resumes={resumes} />
}
