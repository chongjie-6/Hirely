'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Loader2 } from 'lucide-react'
import type { Profile } from '@/types/database'

interface CoverLetterDownloadButtonProps {
  coverLetter: string
  profile: Profile
  jobTitle?: string | null
}

function buildFileName(fullName: string | null, jobTitle?: string | null): string {
  const namePart = fullName
    ?.trim()
    .replace(/\s+/g, '-')
    .toLowerCase() || 'cover-letter'
  const positionPart = jobTitle
    ?.trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

  return positionPart
    ? `${namePart}-${positionPart}-cover-letter.pdf`
    : `${namePart}-cover-letter.pdf`
}

export default function CoverLetterDownloadButton({ coverLetter, profile, jobTitle }: CoverLetterDownloadButtonProps) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: CoverLetterPDF } = await import('@/components/resume/CoverLetterPdf')

      const blob = await pdf(<CoverLetterPDF coverLetter={coverLetter} profile={profile} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = buildFileName(profile.full_name, jobTitle)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Cover letter PDF generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleDownload} disabled={generating}>
      {generating ? (
        <><Loader2 className="size-4 animate-spin mr-2" /> Generating...</>
      ) : (
        <><FileText className="size-4 mr-1" /> Download Cover Letter</>
      )}
    </Button>
  )
}
