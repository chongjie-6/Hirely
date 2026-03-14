'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { experienceSchema, type ExperienceFormData } from '@/lib/validators/schemas'
import { useExperiences } from '@/hooks/use-experiences'
import { useToast } from '@/components/ui/toast'
import { formatDateRange } from '@/lib/utils'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function ExperiencePage() {
  const { experiences, loading, addExperience, updateExperience, deleteExperience } = useExperiences()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { is_current: false },
  })

  const isCurrent = watch('is_current')

  const startEditing = (exp: typeof experiences[0]) => {
    setEditingId(exp.id)
    setShowForm(true)
    reset({
      company: exp.company,
      title: exp.title,
      start_date: exp.start_date ?? '',
      end_date: exp.end_date ?? '',
      is_current: exp.is_current,
      description: exp.description ?? '',
    })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    reset({ company: '', title: '', start_date: '', end_date: '', is_current: false, description: '' })
  }

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      if (editingId) {
        await updateExperience(editingId, data)
        addToast('Experience updated', 'success')
      } else {
        await addExperience({ ...data, sort_order: experiences.length })
        addToast('Experience added', 'success')
      }
      cancelForm()
    } catch {
      addToast('Failed to save experience', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    try {
      await deleteExperience(id)
      addToast('Experience deleted', 'success')
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
          <h2 className="text-lg font-semibold">Work Experience</h2>
          <p className="text-sm text-gray-500">{experiences.length} entries</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); reset(); }}>
            <Plus size={16} className="mr-1" /> Add Experience
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{editingId ? 'Edit' : 'Add'} Experience</h3>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="company" label="Company" error={errors.company?.message} {...register('company')} />
                <Input id="title" label="Job Title" error={errors.title?.message} {...register('title')} />
                <Input id="start_date" type="date" label="Start Date" {...register('start_date')} />
                <div>
                  <Input
                    id="end_date"
                    type="date"
                    label="End Date"
                    disabled={isCurrent}
                    {...register('end_date')}
                  />
                  <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <input type="checkbox" {...register('is_current')} className="rounded" />
                    I currently work here
                  </label>
                </div>
              </div>
              <Textarea
                id="description"
                label="Description"
                placeholder="• Led a team of 5 engineers...&#10;• Increased revenue by 20%..."
                rows={5}
                {...register('description')}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={cancelForm}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>
                  {editingId ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {experiences.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No work experience added yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click &quot;Add Experience&quot; to get started.</p>
          </CardContent>
        </Card>
      )}

      {experiences.map((exp) => (
        <Card key={exp.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                </p>
                {exp.description && (
                  <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => startEditing(exp)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
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
