import ProjectsList from '@/components/projects/projects-form'
import { getProjects } from '@/services/projects/queries'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsList projects={projects} />
}
