'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tailorSchema, type TailorFormData } from '@/lib/validators/schemas'
import { useProfile } from '@/hooks/use-profile'
import { useExperiences } from '@/hooks/use-experiences'
import { useEducation } from '@/hooks/use-education'
import { useSkills } from '@/hooks/use-skills'
import { useProjects } from '@/hooks/use-projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function TailorPage() {
  const router = useRouter()
  const [tailoring, setTailoring] = useState(false)

  const { profile } = useProfile()
  const { experiences } = useExperiences()
  const { education } = useEducation()
  const { skills } = useSkills()
  const { projects } = useProjects()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TailorFormData>({
    resolver: zodResolver(tailorSchema),
  })

  const sections = [
    { label: 'Profile', count: profile?.full_name ? 1 : 0, needed: 1 },
    { label: 'Experience', count: experiences.length, needed: 1 },
    { label: 'Education', count: education.length, needed: 0 },
    { label: 'Skills', count: skills.length, needed: 1 },
    { label: 'Projects', count: projects.length, needed: 0 },
  ]

  const hasMinimumData = profile?.full_name && (experiences.length > 0 || skills.length > 0)

  const onSubmit = async (data: TailorFormData) => {
    if (!hasMinimumData) {
      toast.error('Please add at least your profile name and some experience or skills first')
      return
    }

    setTailoring(true)
    try {
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to tailor resume')
      }

      const result = await response.json()
      toast.success('Resume tailored successfully!')
      router.push(`/resume/${result.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setTailoring(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Description Input */}
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <p className="text-sm text-destructive">{errors.job_description.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={tailoring || !hasMinimumData}
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

        {/* Resume Data Summary */}
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
                    <span className="text-sm">{section.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {section.count} {section.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              ))}

              {!hasMinimumData && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
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
