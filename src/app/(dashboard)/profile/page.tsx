'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validators/schemas'
import { useProfile } from '@/hooks/use-profile'
import { useToast } from '@/components/ui/toast'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Card, { CardContent, CardHeader } from '@/components/ui/card'

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        location: profile.location ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        portfolio_url: profile.portfolio_url ?? '',
        summary: profile.summary ?? '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      addToast('Profile saved successfully', 'success')
    } catch {
      addToast('Failed to save profile', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="text-sm text-gray-500">This information will appear at the top of your resume.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="full_name"
                label="Full Name"
                placeholder="John Doe"
                error={errors.full_name?.message}
                {...register('full_name')}
              />
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="phone"
                label="Phone"
                placeholder="+1 (555) 000-0000"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                id="location"
                label="Location"
                placeholder="San Francisco, CA"
                error={errors.location?.message}
                {...register('location')}
              />
              <Input
                id="linkedin_url"
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/johndoe"
                error={errors.linkedin_url?.message}
                {...register('linkedin_url')}
              />
              <Input
                id="portfolio_url"
                label="Portfolio URL"
                placeholder="https://johndoe.com"
                error={errors.portfolio_url?.message}
                {...register('portfolio_url')}
              />
            </div>

            <Textarea
              id="summary"
              label="Professional Summary"
              placeholder="Brief overview of your professional background and career goals..."
              rows={4}
              error={errors.summary?.message}
              {...register('summary')}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
