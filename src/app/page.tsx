'use client'

import { useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { useFilteredAssignments } from '@/hooks/use-filtered-assignments'
import { useReminders } from '@/hooks/use-reminders'
import { AssignmentList } from '@/components/assignments/assignment-list'
import { AssignmentFiltersBar } from '@/components/assignments/assignment-filters'
import { AssignmentForm } from '@/components/assignments/assignment-form'
import { ReminderToast } from '@/components/reminders/reminder-toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import type { AssignmentFilters } from '@/types/assignment'
import type { Assignment } from '@/types/assignment'
import type { AssignmentId } from '@/types/common'

export default function DashboardPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments, addAssignment, updateAssignment, updateStatus, deleteAssignment } =
    useAssignments(userId)
  const reminders = useReminders(assignments)

  const [filters, setFilters] = useState<AssignmentFilters>({
    courseId: null,
    status: null,
    searchQuery: '',
  })
  const filtered = useFilteredAssignments(assignments, filters)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Assignment | undefined>()
  const [deleteTargetId, setDeleteTargetId] = useState<AssignmentId | null>(null)

  const handleAdd = (data: { courseId: string; title: string; description: string; dueDate: string }) => {
    addAssignment(data)
  }

  const handleEdit = (assignment: Assignment) => {
    setEditTarget(assignment)
    setIsFormOpen(true)
  }

  const handleUpdate = (data: { courseId: string; title: string; description: string; dueDate: string }) => {
    if (editTarget) {
      updateAssignment(editTarget.id, data)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTarget(undefined)
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteAssignment(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <Button onClick={() => setIsFormOpen(true)}>+ 課題を追加</Button>
      </div>

      <AssignmentFiltersBar
        filters={filters}
        courses={courses}
        onFilterChange={setFilters}
      />

      <AssignmentList
        assignments={filtered}
        courses={courses}
        onStatusChange={updateStatus}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
      />

      <AssignmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editTarget ? handleUpdate : handleAdd}
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

      <ReminderToast reminders={reminders} courses={courses} />
    </div>
  )
}
