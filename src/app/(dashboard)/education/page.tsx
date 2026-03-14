'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema, type EducationFormData } from '@/lib/validators/schemas'
import { useEducation } from '@/hooks/use-education'
import { useToast } from '@/components/ui/toast'
import { formatDateRange } from '@/lib/utils'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function EducationPage() {
  const { education, loading, addEducation, updateEducation, deleteEducation } = useEducation()
  const { addToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const startEditing = (edu: typeof education[0]) => {
    setEditingId(edu.id)
    setShowForm(true)
    reset({
      school: edu.school,
      degree: edu.degree ?? '',
      field_of_study: edu.field_of_study ?? '',
      start_date: edu.start_date ?? '',
      end_date: edu.end_date ?? '',
      gpa: edu.gpa ?? '',
      description: edu.description ?? '',
    })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    reset()
  }

  const onSubmit = async (data: EducationFormData) => {
    try {
      if (editingId) {
        await updateEducation(editingId, data)
        addToast('Education updated', 'success')
      } else {
        await addEducation({ ...data, sort_order: education.length })
        addToast('Education added', 'success')
      }
      cancelForm()
    } catch {
      addToast('Failed to save education', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return
    try {
      await deleteEducation(id)
      addToast('Education deleted', 'success')
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
          <h2 className="text-lg font-semibold">Education</h2>
          <p className="text-sm text-gray-500">{education.length} entries</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); reset(); }}>
            <Plus size={16} className="mr-1" /> Add Education
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{editingId ? 'Edit' : 'Add'} Education</h3>
              <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="school" label="School" error={errors.school?.message} {...register('school')} />
                <Input id="degree" label="Degree" placeholder="B.S." {...register('degree')} />
                <Input id="field_of_study" label="Field of Study" placeholder="Computer Science" {...register('field_of_study')} />
                <Input id="gpa" label="GPA" placeholder="3.8" {...register('gpa')} />
                <Input id="start_date" type="date" label="Start Date" {...register('start_date')} />
                <Input id="end_date" type="date" label="End Date" {...register('end_date')} />
              </div>
              <Textarea
                id="description"
                label="Description"
                placeholder="Relevant coursework, honors, activities..."
                rows={3}
                {...register('description')}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={cancelForm}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>{editingId ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {education.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No education added yet.</p>
          </CardContent>
        </Card>
      )}

      {education.map((edu) => (
        <Card key={edu.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {edu.degree && edu.field_of_study
                    ? `${edu.degree} in ${edu.field_of_study}`
                    : edu.degree || edu.field_of_study || 'Degree'}
                </h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDateRange(edu.start_date, edu.end_date)}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                    {edu.description}
                  </div>
                )}
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => startEditing(edu)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(edu.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
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
