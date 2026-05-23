'use client'

import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'
import { formatDate, getDaysUntilDue, getUrgencyLevel } from '@/lib/date-utils'
import { AssignmentStatus } from '@/types/common'
import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'
import type { AssignmentStatusType } from '@/types/common'

interface AssignmentCardProps {
  readonly assignment: Assignment
  readonly course: Course | undefined
  readonly onStatusChange: (status: AssignmentStatusType) => void
  readonly onEdit: () => void
  readonly onDelete: () => void
}

const urgencyStyles = {
  urgent: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-500',
  normal: 'border-l-gray-300',
} as const

export function AssignmentCard({
  assignment,
  course,
  onStatusChange,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const daysUntil = getDaysUntilDue(assignment.dueDate)
  const urgency = assignment.status === AssignmentStatus.COMPLETED ? 'normal' : getUrgencyLevel(daysUntil)

  const daysLabel =
    assignment.status === AssignmentStatus.COMPLETED
      ? '完了済み'
      : daysUntil < 0
        ? `${Math.abs(daysUntil)}日超過`
        : daysUntil === 0
          ? '今日が締切'
          : `あと${daysUntil}日`

  const nextStatuses: readonly AssignmentStatusType[] =
    assignment.status === AssignmentStatus.NOT_STARTED
      ? [AssignmentStatus.IN_PROGRESS, AssignmentStatus.COMPLETED]
      : assignment.status === AssignmentStatus.IN_PROGRESS
        ? [AssignmentStatus.COMPLETED, AssignmentStatus.NOT_STARTED]
        : [AssignmentStatus.NOT_STARTED]

  return (
    <div className={`rounded-lg border border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${urgencyStyles[urgency]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {course && (
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: course.color }}
              />
            )}
            <span className="text-xs text-gray-500">{course?.name ?? '授業未設定'}</span>
          </div>
          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
          {assignment.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={assignment.status} />
            <span className="text-xs text-gray-500">
              締切: {formatDate(assignment.dueDate)}
            </span>
            <span className={`text-xs font-medium ${
              urgency === 'urgent' ? 'text-red-600' :
              urgency === 'warning' ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {daysLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          {nextStatuses.map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(status)}
              title={`ステータスを変更`}
            >
              {status === AssignmentStatus.COMPLETED ? '✓' :
               status === AssignmentStatus.IN_PROGRESS ? '▶' : '↩'}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={onEdit}>
            ✏️
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            🗑️
          </Button>
        </div>
      </div>
    </div>
  )
}
