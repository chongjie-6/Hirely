'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortableSectionProps {
  id: string
  children: React.ReactNode
}

export function SortableSection({ id, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group relative', isDragging && 'opacity-50 z-50')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute -left-7 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-gray-100"
        aria-label={`Reorder ${id} section`}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>
      {children}
    </div>
  )
}
