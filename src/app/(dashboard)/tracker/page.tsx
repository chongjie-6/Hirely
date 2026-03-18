import { getApplicationsWithResumes, getTailoredResumes } from '@/services/queries'
import KanbanBoard from '@/components/tracker/kanban-board'

export default async function TrackerPage() {
  const [applications, resumes] = await Promise.all([
    getApplicationsWithResumes(),
    getTailoredResumes(),
  ])

  return <KanbanBoard applications={applications} resumes={resumes} />
}
