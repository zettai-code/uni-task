'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CalendarGrid } from '@/components/calendar/calendar-grid'
import { AssignmentForm } from '@/components/assignments/assignment-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatusBadge } from '@/components/assignments/status-badge'
import { formatDate, getDaysUntilDue, getMonthLabel } from '@/lib/date-utils'
import { AssignmentStatus } from '@/types/common'
import type { Assignment } from '@/types/assignment'
import type { AssignmentId } from '@/types/common'

export default function CalendarPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useAssignments(userId)

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Assignment | undefined>()
  const [prefillDate, setPrefillDate] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<AssignmentId | null>(null)

  const incompleteAssignments = useMemo(() => {
    return assignments
      .filter((a) => {
        if (a.status === AssignmentStatus.COMPLETED) return false
        if (!a.dueDate) return false
        const due = new Date(a.dueDate)
        return due.getFullYear() === viewYear && due.getMonth() === viewMonth
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [assignments, viewYear, viewMonth])

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
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">カレンダー</h1>
      <CalendarGrid
        assignments={assignments}
        courses={courses}
        onAddAssignment={handleAddFromCalendar}
        onEditAssignment={handleEdit}
        onDeleteAssignment={setDeleteTargetId}
        onMonthChange={(y, m) => { setViewYear(y); setViewMonth(m) }}
      />

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm font-bold text-gray-900">
            {getMonthLabel(viewYear, viewMonth)} の未完了課題
            <span className="ml-2 text-blue-600">({incompleteAssignments.length}件)</span>
          </h2>
        </div>
        {incompleteAssignments.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            この月の未完了課題はありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
                  <th className="px-4 py-2 font-medium">授業</th>
                  <th className="px-4 py-2 font-medium">課題名</th>
                  <th className="px-4 py-2 font-medium">締切日</th>
                  <th className="px-4 py-2 font-medium">残り</th>
                  <th className="px-4 py-2 font-medium">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {incompleteAssignments.map((assignment) => {
                  const course = courses.find((c) => c.id === assignment.courseId)
                  const daysUntil = getDaysUntilDue(assignment.dueDate)
                  const isOverdue = daysUntil < 0

                  return (
                    <tr key={assignment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {course && (
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: course.color }}
                            />
                          )}
                          <span className="truncate max-w-[120px]">{course?.name ?? '未設定'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 truncate max-w-[160px]">
                        {assignment.title || '-'}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {formatDate(assignment.dueDate)}
                      </td>
                      <td className={`px-4 py-2.5 whitespace-nowrap font-medium ${isOverdue ? 'text-red-600' : daysUntil <= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {isOverdue
                          ? `${Math.abs(daysUntil)}日超過`
                          : daysUntil === 0
                            ? '今日'
                            : `あと${daysUntil}日`}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={assignment.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
