import KanbanBoard from '@/components/tracker/kanban-board'
import { getApplicationsWithResumes } from '@/services/applications/queries'
import { getTailoredResumes } from '@/services/resumes/queries'

export default async function TrackerPage() {
  const [applications, resumes] = await Promise.all([
    getApplicationsWithResumes(),
    getTailoredResumes(),
  ])

  return <KanbanBoard applications={applications} resumes={resumes} />
}
