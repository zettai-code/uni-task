'use client'

import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { StatusBadge } from '@/components/assignments/status-badge'
import { formatDate, getDaysUntilDue } from '@/lib/date-utils'
import { AssignmentStatus } from '@/types/common'

export default function TodosPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments, updateStatus } = useAssignments(userId)

  const incompleteAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status !== AssignmentStatus.COMPLETED)
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
  }, [assignments])

  const completedCount = assignments.filter((a) => a.status === AssignmentStatus.COMPLETED).length
  const totalCount = assignments.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ToDoリスト</h1>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            全体進捗: {completedCount} / {totalCount} 件完了
          </span>
          <span className="text-lg font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          未完了: <span className="font-medium text-gray-900">{incompleteAssignments.length}件</span>
        </p>
      </div>

      {incompleteAssignments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">未完了の課題はありません</p>
          <p className="mt-1 text-sm text-gray-400">すべての課題が完了しています</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {incompleteAssignments.map((assignment) => {
            const course = courses.find((c) => c.id === assignment.courseId)
            const hasDueDate = !!assignment.dueDate
            const daysUntil = hasDueDate ? getDaysUntilDue(assignment.dueDate) : null
            const isOverdue = daysUntil !== null && daysUntil < 0
            const isWeekOrLess = daysUntil !== null && daysUntil <= 7
            const isTwoWeeksOrLess = daysUntil !== null && daysUntil <= 14

            return (
              <div
                key={assignment.id}
                className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => updateStatus(assignment.id, AssignmentStatus.COMPLETED)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  title="完了にする"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {course && (
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                    )}
                    <span className="text-xs text-gray-500 truncate">{course?.name ?? '未設定'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {assignment.title || '(課題名なし)'}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StatusBadge status={assignment.status} />
                    {hasDueDate && (
                      <>
                        <span className="text-xs text-gray-500">
                          締切: {formatDate(assignment.dueDate)}
                        </span>
                        {(isOverdue || isWeekOrLess) ? (
                          <TodoCountdown dueDate={assignment.dueDate} />
                        ) : isTwoWeeksOrLess ? (
                          <span className="text-xs font-medium text-yellow-600">
                            あと{daysUntil}日
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            あと{daysUntil}日
                          </span>
                        )}
                      </>
                    )}
                    {!hasDueDate && (
                      <span className="text-xs text-gray-400">締切未設定</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getCountdownText(dueDate: string): { text: string; isOverdue: boolean } {
  const now = new Date()
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999)
  const diffMs = due.getTime() - now.getTime()

  if (diffMs < 0) {
    const elapsed = Math.abs(diffMs)
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
    return { text: `${days}日 ${hours}時間 ${minutes}分 超過`, isOverdue: true }
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return { text: `あと ${days}日 ${hours}時間 ${minutes}分`, isOverdue: false }
}

function TodoCountdown({ dueDate }: { readonly dueDate: string }) {
  const [countdown, setCountdown] = useState(() => getCountdownText(dueDate))

  useEffect(() => {
    setCountdown(getCountdownText(dueDate))
    const id = setInterval(() => setCountdown(getCountdownText(dueDate)), 60000)
    return () => clearInterval(id)
  }, [dueDate])

  return (
    <span className="text-xs font-bold text-red-600">
      {countdown.text}
    </span>
  )
}
