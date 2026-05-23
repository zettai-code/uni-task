'use client'

import { Button } from '@/components/ui/button'
import { CATEGORY_CONFIG, DAY_LABELS, PERIOD_LABELS } from '@/lib/constants'
import { getSubjectIcon } from '@/lib/subject-icons'
import type { Course } from '@/types/course'

interface CourseCardProps {
  readonly course: Course
  readonly assignmentCount: number
  readonly onEdit: () => void
  readonly onDelete: () => void
}

export function CourseCard({ course, assignmentCount, onEdit, onDelete }: CourseCardProps) {
  const icon = getSubjectIcon(course.subject, course.category)

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{course.name}</h3>
            {course.instructor && (
              <p className="text-sm text-gray-500">{course.instructor}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            ✏️
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            🗑️
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>{CATEGORY_CONFIG[course.category]?.label}{course.subject ? ` / ${course.subject}` : ''}</span>
        <span>{DAY_LABELS[course.dayOfWeek]}曜 {PERIOD_LABELS[course.period - 1]}</span>
        <span>課題: {assignmentCount}件</span>
      </div>
    </div>
  )
}
