'use client'

import { AssignmentCard } from './assignment-card'
import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'
import type { AssignmentId, AssignmentStatusType } from '@/types/common'

interface AssignmentListProps {
  readonly assignments: readonly Assignment[]
  readonly courses: readonly Course[]
  readonly onStatusChange: (id: AssignmentId, status: AssignmentStatusType) => void
  readonly onEdit: (assignment: Assignment) => void
  readonly onDelete: (id: AssignmentId) => void
}

export function AssignmentList({
  assignments,
  courses,
  onStatusChange,
  onEdit,
  onDelete,
}: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">課題がありません</p>
        <p className="mt-1 text-sm text-gray-400">「課題を追加」ボタンから新しい課題を登録しましょう</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          course={courses.find((c) => c.id === assignment.courseId)}
          onStatusChange={(status) => onStatusChange(assignment.id, status)}
          onEdit={() => onEdit(assignment)}
          onDelete={() => onDelete(assignment.id)}
        />
      ))}
    </div>
  )
}
