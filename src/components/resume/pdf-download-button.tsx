'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import type { TailoredContent, Profile } from '@/types/database'

interface PDFDownloadButtonProps {
  content: TailoredContent
  profile: Profile
  fileName: string
  showSummary?: boolean
}

export default function PDFDownloadButton({ content, profile, fileName, showSummary = true }: PDFDownloadButtonProps) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: ResumePDF } = await import('@/components/resume/resume-pdf')

      const blob = await pdf(<ResumePDF content={content} profile={profile} showSummary={showSummary} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
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
