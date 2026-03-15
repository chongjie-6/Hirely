'use client'

import * as React from 'react'
import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

interface MonthPickerProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MonthPicker({ value, onChange, disabled, placeholder = 'Pick a month' }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false)

  const currentDate = value ? parse(value, 'yyyy-MM', new Date()) : null
  const [viewYear, setViewYear] = React.useState(currentDate?.getFullYear() ?? new Date().getFullYear())

  const displayValue = currentDate ? format(currentDate, 'MMM yyyy') : null

  const handleSelect = (monthIndex: number) => {
    const formatted = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`
    onChange?.(formatted)
    setOpen(false)
  }

  const selectedMonth = currentDate?.getMonth()
  const selectedYear = currentDate?.getFullYear()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          'flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none cursor-pointer',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
          !displayValue && 'text-muted-foreground',
        )}
      >
        <span className="truncate">{displayValue ?? placeholder}</span>
        <CalendarIcon className="size-4 text-muted-foreground shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={() => setViewYear(y => y - 1)}>
            <span className="text-sm">&lt;</span>
          </Button>
          <span className="text-sm font-medium">{viewYear}</span>
          <Button variant="ghost" size="icon" onClick={() => setViewYear(y => y + 1)}>
            <span className="text-sm">&gt;</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, i) => {
            const isSelected = selectedYear === viewYear && selectedMonth === i
            return (
              <Button
                key={month}
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                className="text-sm"
                onClick={() => handleSelect(i)}
              >
                {month}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
