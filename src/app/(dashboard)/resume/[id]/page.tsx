'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import type { TailoredResume, Profile, TailoredContent } from '@/types/database'
import ResumePreview from '@/components/resume/resume-preview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Lightbulb, Loader2 } from 'lucide-react'

const PDFDownloadButton = dynamic(
  () => import('@/components/resume/pdf-download-button'),
  { ssr: false }
)

export default function ResumePreviewPage() {
  const params = useParams()
  const [resume, setResume] = useState<TailoredResume | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [resumeRes, profileRes] = await Promise.all([
        supabase.from('tailored_resumes').select('*').eq('id', params.id).single(),
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      ])

      if (resumeRes.data) setResume(resumeRes.data as TailoredResume)
      if (profileRes.data) setProfile(profileRes.data)
      setLoading(false)
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  }

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

  const content = resume.tailored_content as TailoredContent
  const suggestions = content.suggestions ?? []

  const getScoreVariant = (score: number | null) => {
    if (!score) return 'secondary' as const
    if (score >= 80) return 'default' as const
    if (score >= 60) return 'secondary' as const
    return 'destructive' as const
  }

  return (
    <div className="max-w-6xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-semibold">
              {resume.job_title || 'Tailored Resume'}
            </h2>
            {resume.company_name && (
              <p className="text-sm text-muted-foreground">{resume.company_name}</p>
            )}
          </div>
          {resume.match_score !== null && (
            <Badge variant={getScoreVariant(resume.match_score)}>
              {resume.match_score}% match
            </Badge>
          )}
        </div>

        <PDFDownloadButton
          content={content}
          profile={profile}
          fileName={`resume-${resume.job_title?.replace(/\s+/g, '-').toLowerCase() || 'tailored'}.pdf`}
          showSummary={showSummary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resume Preview */}
        <div className="lg:col-span-3">
          <ResumePreview content={content} profile={profile} showSummary={showSummary} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-summary"
                  checked={showSummary}
                  onCheckedChange={(checked) => setShowSummary(checked === true)}
                />
                <label htmlFor="show-summary" className="text-sm cursor-pointer select-none">
                  Include professional summary
                </label>
              </div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lightbulb className="size-4 text-amber-500" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground max-h-60 overflow-y-auto whitespace-pre-line">
                {resume.job_description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
