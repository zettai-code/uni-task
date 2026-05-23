'use client'

import { useState, useMemo, useCallback } from 'react'
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
import { Confetti } from '@/components/ui/confetti'
import { Button } from '@/components/ui/button'
import { AssignmentStatus } from '@/types/common'
import type { AssignmentFilters } from '@/types/assignment'
import type { Assignment } from '@/types/assignment'
import type { AssignmentId, AssignmentStatusType } from '@/types/common'

export default function DashboardPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments, addAssignment, updateAssignment, updateStatus, deleteAssignment } =
    useAssignments(userId)
  const reminders = useReminders(assignments)

  const progress = useMemo(() => {
    const total = assignments.length
    if (total === 0) return { total: 0, completed: 0, percent: 0 }
    const completed = assignments.filter((a) => a.status === AssignmentStatus.COMPLETED).length
    return { total, completed, percent: Math.round((completed / total) * 100) }
  }, [assignments])

  const [showConfetti, setShowConfetti] = useState(false)

  const handleStatusChange = useCallback(
    (id: AssignmentId, status: AssignmentStatusType) => {
      updateStatus(id, status)
      if (status === AssignmentStatus.COMPLETED) {
        setShowConfetti(true)
      }
    },
    [updateStatus]
  )

  const [filters, setFilters] = useState<AssignmentFilters>({
    courseId: null,
    status: null,
    category: null,
    subject: null,
    searchQuery: '',
  })
  const filtered = useFilteredAssignments(assignments, filters, courses)

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
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <Button onClick={() => setIsFormOpen(true)} className="shrink-0 text-xs sm:text-sm">+ 課題を追加</Button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            課題の進捗率: {progress.completed} / {progress.total} 件完了
          </span>
          <span className="text-lg font-bold text-blue-600">{progress.percent}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <AssignmentFiltersBar
        filters={filters}
        courses={courses}
        onFilterChange={setFilters}
      />

      <h2 className="text-lg font-bold text-blue-600">課題総一覧</h2>

      <AssignmentList
        assignments={filtered}
        courses={courses}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
        onDueDateChange={(id, dueDate) => updateAssignment(id, { dueDate })}
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
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </div>
  )
}
