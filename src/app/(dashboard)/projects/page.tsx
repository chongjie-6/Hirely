import { getProjects } from '@/services/queries'
import ProjectsList from '@/components/projects/projects-form'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsList projects={projects} />
}
