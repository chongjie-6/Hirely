'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormData } from '@/lib/validators/schemas'
import type { ApplicationWithResume, TailoredResume, ApplicationStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { addApplication, deleteApplication, updateApplication } from '@/services/applications/actions'

interface ApplicationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: ApplicationWithResume | null
  resumes: TailoredResume[]
  defaultStatus?: ApplicationStatus
  onSaved: () => void
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
  resumes,
  defaultStatus = 'applied',
  onSaved,
}: ApplicationFormDialogProps) {
  const isEditing = !!application

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: application
      ? {
          job_title: application.job_title,
          company_name: application.company_name,
          status: application.status,
          applied_date: application.applied_date ?? '',
          notes: application.notes ?? '',
          url: application.url ?? '',
          salary: application.salary ?? '',
          contact_name: application.contact_name ?? '',
          contact_email: application.contact_email ?? '',
          tailored_resume_id: application.tailored_resume_id ?? '',
        }
      : {
          job_title: '',
          company_name: '',
          status: defaultStatus,
          applied_date: new Date().toISOString().split('T')[0],
          notes: '',
          url: '',
          salary: '',
          contact_name: '',
          contact_email: '',
          tailored_resume_id: '',
        },
  })

  const selectedResumeId = watch('tailored_resume_id')

  const handleResumeSelect = (resumeId: string | null) => {
    setValue('tailored_resume_id', resumeId ?? '')
    if (resumeId) {
      const resume = resumes.find((r) => r.id === resumeId)
      if (resume) {
        const currentTitle = watch('job_title')
        const currentCompany = watch('company_name')
        if (!currentTitle && resume.job_title) setValue('job_title', resume.job_title)
        if (!currentCompany && resume.company_name) setValue('company_name', resume.company_name)
      }
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const payload: Record<string, unknown> = {
        job_title: data.job_title,
        company_name: data.company_name,
        status: data.status || defaultStatus,
        applied_date: data.applied_date || null,
        notes: data.notes || null,
        url: data.url || null,
        salary: data.salary || null,
        contact_name: data.contact_name || null,
        contact_email: data.contact_email || null,
        tailored_resume_id: data.tailored_resume_id || null,
      }

      if (isEditing) {
        await updateApplication(application.id, payload)
        toast.success('Application updated')
      } else {
        await addApplication(payload)
        toast.success('Application added')
      }
      reset()
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error(isEditing ? 'Failed to update application' : 'Failed to add application')
    }
  }

  const handleDelete = async () => {
    if (!application) return
    try {
      await deleteApplication(application.id)
      toast.success('Application deleted')
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error('Failed to delete application')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Application' : 'Add Application'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company_name">Company *</Label>
              <Input id="company_name" {...register('company_name')} placeholder="Google" />
              {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input id="job_title" {...register('job_title')} placeholder="Software Engineer" />
              {errors.job_title && <p className="text-xs text-destructive">{errors.job_title.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={watch('status') || defaultStatus} onValueChange={(v) => setValue('status', v as ApplicationStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(STATUS_LABELS) as [ApplicationStatus, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="applied_date">Date Applied</Label>
              <Input id="applied_date" type="date" {...register('applied_date')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" {...register('salary')} placeholder="$120k–$150k" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url">Job Posting URL</Label>
              <Input id="url" {...register('url')} placeholder="https://..." />
              {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input id="contact_name" {...register('contact_name')} placeholder="Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input id="contact_email" {...register('contact_email')} placeholder="jane@company.com" />
              {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
            </div>
          </div>

          {resumes.length > 0 && (
            <div className="space-y-1.5">
              <Label>Link Resume</Label>
              <Select value={selectedResumeId || ''} onValueChange={handleResumeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tailored resume..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.job_title || 'Untitled'} — {r.company_name || 'Unknown'}
                      {r.match_score !== null && ` (${r.match_score}%)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Interview prep notes, follow-up reminders..." rows={3} />
          </div>

          <DialogFooter>
            {isEditing && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="mr-auto">
                <Trash2 className="size-4 mr-1" />
                Delete
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
