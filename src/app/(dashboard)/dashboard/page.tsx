import { getTailoredResumes } from '@/services/queries'
import ResumeList from '@/components/dashboard/resume-list'

export default async function DashboardPage() {
  const resumes = await getTailoredResumes()

  return <ResumeList resumes={resumes} />
}
