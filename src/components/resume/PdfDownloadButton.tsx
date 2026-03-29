'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import type { TailoredContent, Profile } from '@/types/database'

interface PDFDownloadButtonProps {
  content: TailoredContent
  profile: Profile
  jobTitle?: string | null
  showSummary?: boolean
  includeCoverLetter?: boolean
}

function buildFileName(fullName: string | null, jobTitle?: string | null): string {
  const namePart = fullName
    ?.trim()
    .replace(/\s+/g, '-')
    .toLowerCase() || 'resume'
  const positionPart = jobTitle
    ?.trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

  return positionPart
    ? `${namePart}-${positionPart}.pdf`
    : `${namePart}-resume.pdf`
}

export default function PDFDownloadButton({ content, profile, jobTitle, showSummary = true, includeCoverLetter = false }: PDFDownloadButtonProps) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: ResumePDF } = await import('@/components/resume/ResumePdf')

      const blob = await pdf(<ResumePDF content={content} profile={profile} showSummary={showSummary} includeCoverLetter={includeCoverLetter} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = buildFileName(profile.full_name, jobTitle)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={generating}>
      {generating ? (
        <><Loader2 className="size-4 animate-spin mr-2" /> Generating...</>
      ) : (
        <><Download className="size-4 mr-1" /> Download PDF</>
      )}
    </Button>
  )
}
