'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { ApplicationWithResume } from '@/types/database'

interface ApplicationCardOverlayProps {
  application: ApplicationWithResume
}

export function ApplicationCardOverlay({ application }: ApplicationCardOverlayProps) {
  return (
    <Card className="p-3 shadow-lg border-primary/50 rotate-2 w-[260px]">
      <p className="font-semibold text-sm truncate">{application.company_name}</p>
      <p className="text-sm text-muted-foreground truncate">{application.job_title}</p>
      {application.applied_date && (
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(application.applied_date), 'MMM d, yyyy')}
        </p>
      )}
      {application.tailored_resume && application.tailored_resume.match_score !== null && (
        <Badge variant="secondary" className="text-xs mt-2">
          {application.tailored_resume.match_score}% match
        </Badge>
      )}
    </Card>
  )
}
