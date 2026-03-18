'use client'

import { useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { reorderApplications } from '@/services/actions'
import { KanbanColumn } from '@/components/tracker/kanban-column'
import { ApplicationCardOverlay } from '@/components/tracker/application-card-overlay'
import { ApplicationFormDialog } from '@/components/tracker/application-form-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { ApplicationWithResume, ApplicationStatus, TailoredResume } from '@/types/database'
import { APPLICATION_STATUSES } from '@/types/database'

interface KanbanBoardProps {
  applications: ApplicationWithResume[]
  resumes: TailoredResume[]
}

type ColumnMap = Record<ApplicationStatus, ApplicationWithResume[]>

function groupByStatus(applications: ApplicationWithResume[]): ColumnMap {
  const map: ColumnMap = {
    applied: [],
    phone_screen: [],
    interview: [],
    offer: [],
    rejected: [],
  }
  for (const app of applications) {
    map[app.status].push(app)
  }
  return map
}

function findColumnForCard(columns: ColumnMap, cardId: string): ApplicationStatus | null {
  for (const status of APPLICATION_STATUSES) {
    if (columns[status].some((a) => a.id === cardId)) {
      return status
    }
  }
  return null
}

export default function KanbanBoard({ applications, resumes }: KanbanBoardProps) {
  const router = useRouter()
  const [columns, setColumns] = useState<ColumnMap>(() => groupByStatus(applications))
  const [activeCard, setActiveCard] = useState<ApplicationWithResume | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<ApplicationWithResume | null>(null)
  const [addToStatus, setAddToStatus] = useState<ApplicationStatus>('applied')

  // Ref to track columns during drag without stale closures
  const columnsRef = useRef(columns)
  columnsRef.current = columns

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const cardId = event.active.id as string
    const status = findColumnForCard(columnsRef.current, cardId)
    if (status) {
      const card = columnsRef.current[status].find((a) => a.id === cardId)
      setActiveCard(card ?? null)
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourceCol = findColumnForCard(columnsRef.current, activeId)
    if (!sourceCol) return

    // Determine destination column
    let destCol: ApplicationStatus | null = null
    if (overId.startsWith('column-')) {
      destCol = overId.replace('column-', '') as ApplicationStatus
    } else {
      destCol = findColumnForCard(columnsRef.current, overId)
    }
    if (!destCol || sourceCol === destCol) return

    // Move card from source to destination
    setColumns((prev) => {
      const sourceItems = [...prev[sourceCol]]
      const destItems = [...prev[destCol]]
      const activeIndex = sourceItems.findIndex((a) => a.id === activeId)
      if (activeIndex === -1) return prev

      const [movedCard] = sourceItems.splice(activeIndex, 1)
      const updatedCard = { ...movedCard, status: destCol }

      // Find insertion index
      const overIndex = destItems.findIndex((a) => a.id === overId)
      if (overIndex >= 0) {
        destItems.splice(overIndex, 0, updatedCard)
      } else {
        destItems.push(updatedCard)
      }

      return { ...prev, [sourceCol]: sourceItems, [destCol]: destItems }
    })
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCol = findColumnForCard(columnsRef.current, activeId)
    if (!activeCol) return

    // Handle reorder within same column
    if (!overId.startsWith('column-')) {
      const overCol = findColumnForCard(columnsRef.current, overId)
      if (overCol === activeCol && activeId !== overId) {
        setColumns((prev) => {
          const items = [...prev[activeCol]]
          const oldIndex = items.findIndex((a) => a.id === activeId)
          const newIndex = items.findIndex((a) => a.id === overId)
          const reordered = arrayMove(items, oldIndex, newIndex)
          return { ...prev, [activeCol]: reordered }
        })
      }
    }

    // Persist all affected columns
    // Use a timeout to ensure state has settled
    setTimeout(() => {
      const current = columnsRef.current
      const updates: { id: string; status: ApplicationStatus; sort_order: number }[] = []

      for (const status of APPLICATION_STATUSES) {
        current[status].forEach((app, index) => {
          if (app.sort_order !== index || app.status !== status) {
            updates.push({ id: app.id, status, sort_order: index })
          }
        })
      }

      if (updates.length > 0) {
        reorderApplications(updates).catch(console.error)
      }
    }, 0)
  }, [])

  const handleCardClick = useCallback((app: ApplicationWithResume) => {
    setEditingApp(app)
    setDialogOpen(true)
  }, [])

  const handleAddNew = useCallback(() => {
    setEditingApp(null)
    setAddToStatus('applied')
    setDialogOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    router.refresh()
  }, [router])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Application Tracker</h2>
        <Button onClick={handleAddNew} size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Add Application
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {APPLICATION_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={columns[status]}
              onCardClick={handleCardClick}
            />
          ))}

          {typeof document !== 'undefined' &&
            createPortal(
              <DragOverlay>
                {activeCard ? <ApplicationCardOverlay application={activeCard} /> : null}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
      </div>

      <ApplicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={editingApp}
        resumes={resumes}
        defaultStatus={addToStatus}
        onSaved={handleSaved}
      />
    </div>
  )
}
