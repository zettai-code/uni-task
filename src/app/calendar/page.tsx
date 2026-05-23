'use client'

import { useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CalendarGrid } from '@/components/calendar/calendar-grid'
import { AssignmentForm } from '@/components/assignments/assignment-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import type { Assignment } from '@/types/assignment'
import type { AssignmentId } from '@/types/common'

export default function CalendarPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useAssignments(userId)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Assignment | undefined>()
  const [prefillDate, setPrefillDate] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<AssignmentId | null>(null)

  const handleAddFromCalendar = (dateStr: string) => {
    setPrefillDate(dateStr)
    setEditTarget(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (assignment: Assignment) => {
    setEditTarget(assignment)
    setPrefillDate('')
    setIsFormOpen(true)
  }

  const handleSubmit = (data: { courseId: string; title: string; description: string; dueDate: string }) => {
    if (editTarget) {
      updateAssignment(editTarget.id, data)
    } else {
      addAssignment({ ...data, dueDate: data.dueDate || prefillDate })
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTarget(undefined)
    setPrefillDate('')
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteAssignment(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>
      <CalendarGrid
        assignments={assignments}
        courses={courses}
        onAddAssignment={handleAddFromCalendar}
        onEditAssignment={handleEdit}
        onDeleteAssignment={setDeleteTargetId}
      />

      <AssignmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        courses={courses}
        editTarget={editTarget}
      />

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="課題を削除"
        message="この課題を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  )
}
