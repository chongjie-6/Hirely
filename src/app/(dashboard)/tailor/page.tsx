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
import { useToast } from '@/components/ui/toast'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

export default function TailorPage() {
  const router = useRouter()
  const { addToast } = useToast()
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
      addToast('Please add at least your profile name and some experience or skills first', 'error')
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
      addToast('Resume tailored successfully!', 'success')
      router.push(`/resume/${result.id}`)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Something went wrong', 'error')
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
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                Tailor Your Resume
              </h2>
              <p className="text-sm text-gray-500">Paste a job description and we&apos;ll tailor your resume to match.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="job_title"
                    label="Job Title (optional)"
                    placeholder="Senior Software Engineer"
                    {...register('job_title')}
                  />
                  <Input
                    id="company_name"
                    label="Company (optional)"
                    placeholder="Google"
                    {...register('company_name')}
                  />
                </div>

                <Textarea
                  id="job_description"
                  label="Job Description"
                  placeholder="Paste the full job description here..."
                  rows={12}
                  error={errors.job_description?.message}
                  {...register('job_description')}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={tailoring}
                  disabled={!hasMinimumData}
                >
                  {tailoring ? 'Tailoring with AI...' : 'Tailor My Resume'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resume Data Summary */}
        <div>
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Your Resume Data</h3>
              <p className="text-xs text-gray-400">We&apos;ll use this to tailor your resume</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map(section => (
                <div key={section.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {section.count > 0 ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : section.needed > 0 ? (
                      <AlertCircle size={16} className="text-amber-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="text-sm text-gray-700">{section.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {section.count} {section.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              ))}

              {!hasMinimumData && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-700">
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
