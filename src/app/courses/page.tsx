'use client'

import { useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CourseList } from '@/components/courses/course-list'
import { CourseForm } from '@/components/courses/course-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import type { Course } from '@/types/course'
import type { CourseId } from '@/types/common'

export default function CoursesPage() {
  const { userId } = useAuth()
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses(userId)
  const { assignments, deleteAssignmentsByCourse } = useAssignments(userId)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Course | undefined>()
  const [deleteTargetId, setDeleteTargetId] = useState<CourseId | null>(null)

  const handleAdd = (data: { name: string; instructor: string; color: string; dayOfWeek: number; period: number }) => {
    addCourse(data)
  }

  const handleEdit = (course: Course) => {
    setEditTarget(course)
    setIsFormOpen(true)
  }

  const handleUpdate = (data: { name: string; instructor: string; color: string; dayOfWeek: number; period: number }) => {
    if (editTarget) {
      updateCourse(editTarget.id, data)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTarget(undefined)
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteAssignmentsByCourse(deleteTargetId)
      deleteCourse(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  const deleteTargetCourse = deleteTargetId
    ? courses.find((c) => c.id === deleteTargetId)
    : null
  const deleteTargetAssignmentCount = deleteTargetId
    ? assignments.filter((a) => a.courseId === deleteTargetId).length
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">授業管理</h1>
        <Button onClick={() => setIsFormOpen(true)}>+ 授業を追加</Button>
      </div>

      <CourseList
        courses={courses}
        assignments={assignments}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
      />

      <CourseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editTarget ? handleUpdate : handleAdd}
        editTarget={editTarget}
      />

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="授業を削除"
        message={
          deleteTargetCourse
            ? `「${deleteTargetCourse.name}」を削除してもよろしいですか？${
                deleteTargetAssignmentCount > 0
                  ? `関連する課題${deleteTargetAssignmentCount}件も一緒に削除されます。`
                  : ''
              }この操作は取り消せません。`
            : ''
        }
      />
    </div>
  )
}
