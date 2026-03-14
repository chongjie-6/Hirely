'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import type { TailoredResume, Profile, TailoredContent } from '@/types/database'
import ResumePreview from '@/components/resume/resume-preview'
import Button from '@/components/ui/button'
import Card, { CardContent, CardHeader } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { Download, ArrowLeft, Lightbulb } from 'lucide-react'

// Dynamic import for PDF (only loaded client-side when needed)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
)

const ResumePDF = dynamic(() => import('@/components/resume/resume-pdf'), { ssr: false })

export default function ResumePreviewPage() {
  const params = useParams()
  const [resume, setResume] = useState<TailoredResume | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdfReady, setPdfReady] = useState(false)

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

      // Delay PDF readiness to avoid hydration issues
      setTimeout(() => setPdfReady(true), 500)
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  if (!resume || !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Resume not found.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const content = resume.tailored_content as TailoredContent
  const suggestions = content.suggestions ?? []

  const getScoreColor = (score: number | null) => {
    if (!score) return 'default'
    if (score >= 80) return 'success' as const
    if (score >= 60) return 'warning' as const
    return 'danger' as const
  }

  return (
    <div className="max-w-6xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold">
              {resume.job_title || 'Tailored Resume'}
            </h2>
            {resume.company_name && (
              <p className="text-sm text-gray-500">{resume.company_name}</p>
            )}
          </div>
          {resume.match_score !== null && (
            <Badge variant={getScoreColor(resume.match_score)}>
              {resume.match_score}% match
            </Badge>
          )}
        </div>

        <div>
          {pdfReady && (
            <PDFDownloadLink
              document={<ResumePDF content={content} profile={profile} />}
              fileName={`resume-${resume.job_title?.replace(/\s+/g, '-').toLowerCase() || 'tailored'}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <Button loading={pdfLoading} disabled={pdfLoading}>
                  <Download size={16} className="mr-1" />
                  {pdfLoading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resume Preview */}
        <div className="lg:col-span-3">
          <ResumePreview content={content} profile={profile} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" />
                  Suggestions
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-sm">Job Description</h3>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 max-h-60 overflow-y-auto whitespace-pre-line">
                {resume.job_description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
