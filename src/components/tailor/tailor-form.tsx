'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tailorSchema, type TailorFormData } from '@/lib/validators/schemas'
import { tailorResume } from '@/services/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ResumeDataSummary {
  hasProfile: boolean
  experienceCount: number
  educationCount: number
  skillsCount: number
  projectsCount: number
  hasMinimumData: boolean
}

export default function TailorForm({ summary }: { summary: ResumeDataSummary }) {
  const router = useRouter()
  const [tailoring, setTailoring] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TailorFormData>({
    resolver: zodResolver(tailorSchema),
  })

  const sections = [
    { label: 'Profile', count: summary.hasProfile ? 1 : 0, needed: 1 },
    { label: 'Experience', count: summary.experienceCount, needed: 1 },
    { label: 'Education', count: summary.educationCount, needed: 0 },
    { label: 'Skills', count: summary.skillsCount, needed: 1 },
    { label: 'Projects', count: summary.projectsCount, needed: 0 },
  ]

  const onSubmit = async (data: TailorFormData) => {
    if (!summary.hasMinimumData) {
      toast.error('Please add at least your profile name and some experience or skills first')
      return
    }

    setTailoring(true)
    try {
      const result = await tailorResume(data)
      toast.success('Resume tailored successfully!')
      router.push(`/resume/${result.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setTailoring(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Tailor Your Resume
              </CardTitle>
              <CardDescription>Paste a job description and we&apos;ll tailor your resume to match.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title (optional)</Label>
                    <Input id="job_title" placeholder="Senior Software Engineer" {...register('job_title')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company (optional)</Label>
                    <Input id="company_name" placeholder="Google" {...register('company_name')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_description">Job Description</Label>
                  <Textarea
                    id="job_description"
                    placeholder="Paste the full job description here..."
                    rows={12}
                    {...register('job_description')}
                  />
                  {errors.job_description && (
                    <p className="text-base text-destructive">{errors.job_description.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={tailoring || !summary.hasMinimumData}
                >
                  {tailoring ? (
                    <><Loader2 className="size-4 animate-spin mr-2" /> Tailoring with AI...</>
                  ) : (
                    'Tailor My Resume'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Resume Data</CardTitle>
              <CardDescription>We&apos;ll use this to tailor your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map(section => (
                <div key={section.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {section.count > 0 ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : section.needed > 0 ? (
                      <AlertCircle className="size-4 text-amber-500" />
                    ) : (
                      <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="text-base">{section.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {section.count} {section.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              ))}

              {!summary.hasMinimumData && (
                <div className="mt-4 p-3 bg-amber-950/20 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Please add at least your name in Profile and some Experience or Skills before tailoring.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
