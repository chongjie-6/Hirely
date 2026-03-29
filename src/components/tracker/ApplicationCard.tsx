'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApplicationWithResume } from '@/types/database'

interface ApplicationCardProps {
  application: ApplicationWithResume
  onClick: () => void
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn('group', isDragging && 'opacity-50 z-50')}>
      <Card
        className="p-3 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted shrink-0 mt-0.5"
            aria-label={`Drag ${application.company_name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{application.company_name}</p>
            <p className="text-sm text-muted-foreground truncate">{application.job_title}</p>
            {application.applied_date && (
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(application.applied_date), 'MMM d, yyyy')}
              </p>
            )}
            {application.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {application.notes}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {application.tailored_resume && application.tailored_resume.match_score !== null && (
                <Badge variant="secondary" className="text-xs">
                  {application.tailored_resume.match_score}% match
                </Badge>
              )}
              {application.url && (
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3" />
                </a>
              )}
              {application.salary && (
                <span className="text-xs text-muted-foreground">{application.salary}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
