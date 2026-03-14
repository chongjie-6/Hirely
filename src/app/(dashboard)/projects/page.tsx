'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validators/schemas'
import { useProjects } from '@/hooks/use-projects'
import { useToast } from '@/components/ui/toast'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react'

export default function ProjectsPage() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { technologies: [] },
  })

  const startEditing = (proj: typeof projects[0]) => {
    setEditingId(proj.id)
    setShowForm(true)
    setTechnologies(proj.technologies ?? [])
    reset({
      name: proj.name,
      description: proj.description ?? '',
      live_url: proj.live_url ?? '',
      repo_url: proj.repo_url ?? '',
    })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setTechnologies([])
    setTechInput('')
    reset()
  }

  const addTech = () => {
    const tech = techInput.trim()
    if (tech && !technologies.includes(tech)) {
      setTechnologies(prev => [...prev, tech])
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setTechnologies(prev => prev.filter(t => t !== tech))
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = { ...data, technologies }
      if (editingId) {
        await updateProject(editingId, payload)
        addToast('Project updated', 'success')
      } else {
        await addProject({ ...payload, sort_order: projects.length })
        addToast('Project added', 'success')
      }
      cancelForm()
    } catch {
      addToast('Failed to save project', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      addToast('Project deleted', 'success')
    } catch {
      addToast('Failed to delete', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-gray-500">{projects.length} projects</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); reset(); setTechnologies([]); }}>
            <Plus size={16} className="mr-1" /> Add Project
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{editingId ? 'Edit' : 'Add'} Project</h3>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="name" label="Project Name" error={errors.name?.message} {...register('name')} />
              <Textarea
                id="description"
                label="Description"
                placeholder="What does this project do? What problem does it solve?"
                rows={3}
                {...register('description')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <div className="flex gap-2">
                  <input
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="e.g. React, Node.js"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="button" variant="secondary" onClick={addTech}>Add</Button>
                </div>
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map(tech => (
                      <Badge key={tech} onRemove={() => removeTech(tech)}>{tech}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="live_url" label="Live URL" placeholder="https://..." {...register('live_url')} />
                <Input id="repo_url" label="Repository URL" placeholder="https://github.com/..." {...register('repo_url')} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={cancelForm}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>{editingId ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No projects added yet.</p>
          </CardContent>
        </Card>
      )}

      {projects.map((proj) => (
        <Card key={proj.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                {proj.description && (
                  <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                )}
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.technologies.map(tech => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-2">
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                  {proj.repo_url && (
                    <a href={proj.repo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                      <ExternalLink size={12} /> Repo
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => startEditing(proj)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(proj.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
