'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validators/schemas'
import type { Project } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X, ExternalLink, Loader2 } from 'lucide-react'
import { addProject, deleteProject, updateProject } from '@/services/projects/action'

export default function ProjectsList({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
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

  const startEditing = (proj: Project) => {
    setEditingId(proj.id)
    setShowForm(true)
    setTechnologies(proj.technologies ?? [])
    reset({
      name: proj.name,
      description: proj.description ?? '',
      live_url: proj.live_url ?? '',
      repo_url: proj.repo_url ?? '',
      technologies: proj.technologies ?? [],
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
        const updated = await updateProject(editingId, payload)
        setProjects(prev => prev.map(p => p.id === editingId ? updated : p))
        toast.success('Project updated')
      } else {
        const added = await addProject({ ...payload, sort_order: projects.length })
        setProjects(prev => [...prev, added])
        toast.success('Project added')
      }
      cancelForm()
    } catch {
      toast.error('Failed to save project')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-base text-muted-foreground">{projects.length} projects</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); reset(); setTechnologies([]); }}>
            <Plus className="size-4 mr-1" /> Add Project
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? 'Edit' : 'Add'} Project</CardTitle>
              <Button variant="ghost" size="icon" onClick={cancelForm}>
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-base text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this project do? What problem does it solve?"
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="e.g. React, Node.js"
                  />
                  <Button type="button" variant="outline" onClick={addTech}>Add</Button>
                </div>
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="gap-1 pr-1">
                        {tech}
                        <button onClick={() => removeTech(tech)} className="ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-foreground/10 size-4">
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input id="live_url" placeholder="https://..." {...register('live_url')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo_url">Repository URL</Label>
                  <Input id="repo_url" placeholder="https://github.com/..." {...register('repo_url')} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={cancelForm}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects added yet.</p>
          </CardContent>
        </Card>
      )}

      {projects.map((proj) => (
        <Card key={proj.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{proj.name}</h3>
                {proj.description && (
                  <p className="text-base text-muted-foreground mt-1">{proj.description}</p>
                )}
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.technologies.map(tech => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-2">
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <ExternalLink className="size-3" /> Live
                    </a>
                  )}
                  {proj.repo_url && (
                    <a href={proj.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <ExternalLink className="size-3" /> Repo
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <Button variant="ghost" size="icon" onClick={() => startEditing(proj)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(proj.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
