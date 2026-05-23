'use client'

import { CourseCard } from './course-card'
import type { Course } from '@/types/course'
import type { Assignment } from '@/types/assignment'
import type { CourseId } from '@/types/common'

interface CourseListProps {
  readonly courses: readonly Course[]
  readonly assignments: readonly Assignment[]
  readonly onEdit: (course: Course) => void
  readonly onDelete: (id: CourseId) => void
}

export function CourseList({ courses, assignments, onEdit, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">授業が登録されていません</p>
        <p className="mt-1 text-sm text-gray-400">「授業を追加」ボタンから登録しましょう</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          assignmentCount={assignments.filter((a) => a.courseId === course.id).length}
          onEdit={() => onEdit(course)}
          onDelete={() => onDelete(course.id)}
        />
      ))}
    </div>
  )
}
