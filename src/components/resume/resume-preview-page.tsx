'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { TailoredResume, Profile, TailoredContent } from '@/types/database'
import ResumePreview from '@/components/resume/resume-preview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Lightbulb, FileText } from 'lucide-react'

const PDFDownloadButton = dynamic(
  () => import('@/components/resume/pdf-download-button'),
  { ssr: false }
)

const CoverLetterDownloadButton = dynamic(
  () => import('@/components/resume/cover-letter-download-button'),
  { ssr: false }
)

export default function ResumePreviewClient({
  resume,
  profile,
}: {
  resume: TailoredResume
  profile: Profile
}) {
  const content = resume.tailored_content as TailoredContent

  const [showSummary, setShowSummary] = useState(true)
  const [includeCoverLetter, setIncludeCoverLetter] = useState(!!content.coverLetter)
  const suggestions = content.suggestions ?? []

  const getScoreVariant = (score: number | null) => {
    if (!score) return 'secondary' as const
    if (score >= 80) return 'default' as const
    if (score >= 60) return 'secondary' as const
    return 'destructive' as const
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold">
              {resume.job_title || 'Tailored Resume'}
            </h2>
            {resume.company_name && (
              <p className="text-base text-muted-foreground">{resume.company_name}</p>
            )}
          </div>
          {resume.match_score !== null && (
            <Badge variant={getScoreVariant(resume.match_score)}>
              {resume.match_score}% match
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {content.coverLetter && (
            <CoverLetterDownloadButton
              coverLetter={content.coverLetter}
              profile={profile}
              jobTitle={resume.job_title}
            />
          )}
          <PDFDownloadButton
            content={content}
            profile={profile}
            jobTitle={resume.job_title}
            showSummary={showSummary}
            includeCoverLetter={includeCoverLetter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ResumePreview content={content} profile={profile} showSummary={showSummary} />

          {content.coverLetter && includeCoverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {content.coverLetter}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-summary"
                    checked={showSummary}
                    onCheckedChange={(checked) => setShowSummary(checked === true)}
                  />
                  <label htmlFor="show-summary" className="text-base cursor-pointer select-none">
                    Include professional summary
                  </label>
                </div>
                {content.coverLetter && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-cover-letter"
                      checked={includeCoverLetter}
                      onCheckedChange={(checked) => setIncludeCoverLetter(checked === true)}
                    />
                    <label htmlFor="include-cover-letter" className="text-base cursor-pointer select-none flex items-center gap-1.5">
                      <FileText className="size-3.5 text-muted-foreground" />
                      Include cover letter in PDF
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="size-4 text-amber-500" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="text-base text-muted-foreground flex gap-2">
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
              <CardTitle className="text-base">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground max-h-60 overflow-y-auto whitespace-pre-line">
                {resume.job_description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
