import Link from 'next/link'
import { getProfile, getTailoredResume } from '@/services/queries'
import ResumePreviewClient from '@/components/resume/resume-preview-page'

export default async function ResumePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [resume, profile] = await Promise.all([
    getTailoredResume(id),
    getProfile(),
  ])

  if (!resume || !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Resume not found.</p>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return <ResumePreviewClient resume={resume} profile={profile} />
}
