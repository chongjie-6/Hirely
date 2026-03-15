'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema, type EducationFormData } from '@/lib/validators/schemas'
import { addEducation, updateEducation, deleteEducation } from '@/services/actions'
import { formatDateRange } from '@/lib/utils'
import type { Education } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { MonthPicker } from '@/components/ui/month-picker'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'

export default function EducationList({ education: initialEducation }: { education: Education[] }) {
  const [education, setEducation] = useState(initialEducation)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  })

  const startEditing = (edu: Education) => {
    setEditingId(edu.id)
    setShowForm(true)
    reset({
      school: edu.school,
      degree: edu.degree ?? '',
      field_of_study: edu.field_of_study ?? '',
      start_date: edu.start_date?.slice(0, 7) ?? '',
      end_date: edu.end_date?.slice(0, 7) ?? '',
      gpa: edu.gpa ?? '',
      description: edu.description ?? '',
    })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    reset()
  }

  const onSubmit = async (raw: EducationFormData) => {
    const data = {
      ...raw,
      start_date: raw.start_date ? `${raw.start_date}-01` : null,
      end_date: raw.end_date ? `${raw.end_date}-01` : null,
      gpa: raw.gpa || null,
    }
    try {
      if (editingId) {
        const updated = await updateEducation(editingId, data)
        setEducation(prev => prev.map(e => e.id === editingId ? updated : e))
        toast.success('Education updated')
      } else {
        const added = await addEducation({ ...data, sort_order: education.length })
        setEducation(prev => [...prev, added])
        toast.success('Education added')
      }
      cancelForm()
    } catch {
      toast.error('Failed to save education')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return
    try {
      await deleteEducation(id)
      setEducation(prev => prev.filter(e => e.id !== id))
      toast.success('Education deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Education</h2>
          <p className="text-base text-muted-foreground">{education.length} entries</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingId(null); reset(); }}>
            <Plus className="size-4 mr-1" /> Add Education
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? 'Edit' : 'Add'} Education</CardTitle>
              <Button variant="ghost" size="icon" onClick={cancelForm}>
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input id="school" {...register('school')} />
                  {errors.school && <p className="text-base text-destructive">{errors.school.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input id="degree" placeholder="B.S." {...register('degree')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input id="field_of_study" placeholder="Computer Science" {...register('field_of_study')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input id="gpa" placeholder="3.8" {...register('gpa')} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Controller
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                      <MonthPicker value={field.value} onChange={field.onChange} placeholder="Select start" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Controller
                    control={control}
                    name="end_date"
                    render={({ field }) => (
                      <MonthPicker value={field.value} onChange={field.onChange} placeholder="Select end" />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  id="description"
                  placeholder="Relevant coursework, honors, activities..."
                  rows={3}
                  {...register('description')}
                />
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

      {education.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No education added yet.</p>
          </CardContent>
        </Card>
      )}

      {education.map((edu) => (
        <Card key={edu.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {edu.degree && edu.field_of_study
                    ? `${edu.degree} in ${edu.field_of_study}`
                    : edu.degree || edu.field_of_study || 'Degree'}
                </h3>
                <p className="text-muted-foreground">{edu.school}</p>
                <p className="text-base text-muted-foreground/60 mt-1">
                  {formatDateRange(edu.start_date, edu.end_date)}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </p>
                {edu.description && (
                  <div className="mt-3 text-base whitespace-pre-line">{edu.description}</div>
                )}
              </div>
              <div className="flex gap-1 ml-4">
                <Button variant="ghost" size="icon" onClick={() => startEditing(edu)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id)}>
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
