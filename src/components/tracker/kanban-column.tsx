'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ApplicationCard } from '@/components/tracker/application-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApplicationWithResume, ApplicationStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: ApplicationWithResume[]
  onCardClick: (application: ApplicationWithResume) => void
}

export function KanbanColumn({ status, applications, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}` })

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <Badge variant="secondary" className="text-xs">
          {applications.length}
        </Badge>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-2 rounded-lg bg-muted/50 space-y-2 min-h-[120px] transition-colors',
          isOver && 'bg-primary/10 ring-2 ring-primary/20',
        )}
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => onCardClick(app)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
