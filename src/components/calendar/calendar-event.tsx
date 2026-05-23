'use client'

import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'
import { StatusBadge } from '@/components/assignments/status-badge'

interface CalendarEventProps {
  readonly assignment: Assignment
  readonly course: Course | undefined
}

export function CalendarEvent({ assignment, course }: CalendarEventProps) {
  return (
    <div
      className="mb-0.5 truncate rounded px-1 py-0.5 text-xs"
      style={{ backgroundColor: course?.color ? `${course.color}20` : '#f3f4f6' }}
      title={`${assignment.title} (${course?.name ?? '未設定'})`}
    >
      <span
        className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: course?.color ?? '#9ca3af' }}
      />
      {assignment.title}
    </div>
  )
}
