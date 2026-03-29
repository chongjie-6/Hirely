'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validators/schemas'
import type { Profile } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateProfile } from '@/services/profile/actions'

export default function ProfileForm({ profile }: { profile: Profile | null }) {
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
      toast.success('Profile saved successfully')
    } catch {
      toast.error('Failed to save profile')
    }
  }

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>This information will appear at the top of your resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" {...register('full_name')} />
                {errors.full_name && <p className="text-base text-destructive">{errors.full_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
                {errors.email && <p className="text-base text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="San Francisco, CA" {...register('location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input id="linkedin_url" placeholder="https://linkedin.com/in/johndoe" {...register('linkedin_url')} />
                {errors.linkedin_url && <p className="text-base text-destructive">{errors.linkedin_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input id="portfolio_url" placeholder="https://johndoe.com" {...register('portfolio_url')} />
                {errors.portfolio_url && <p className="text-base text-destructive">{errors.portfolio_url.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                id="summary"
                placeholder="Brief overview of your professional background and career goals..."
                rows={4}
                {...register('summary')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" /> Saving...</> : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
