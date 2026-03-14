import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatDateRange(start: string | Date | null, end: string | Date | null, isCurrent?: boolean): string {
  const startStr = formatDate(start)
  if (isCurrent) return `${startStr} - Present`
  const endStr = formatDate(end)
  return `${startStr} - ${endStr}`
}
