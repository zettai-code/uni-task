'use client'

import { useState, useEffect, useRef } from 'react'
import { StatusBadge } from './status-badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateForInput, getDaysUntilDue, getUrgencyLevel } from '@/lib/date-utils'
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
  readonly onDueDateChange: (dueDate: string) => void
}

const urgencyStyles = {
  urgent: 'border-l-gray-300',
  warning: 'border-l-gray-300',
  info: 'border-l-gray-300',
  normal: 'border-l-gray-300',
} as const

export function AssignmentCard({
  assignment,
  course,
  onStatusChange,
  onEdit,
  onDelete,
  onDueDateChange,
}: AssignmentCardProps) {
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editDate, setEditDate] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)

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

  const handleOpenDateEdit = () => {
    setEditDate(formatDateForInput(assignment.dueDate))
    setIsEditingDate(true)
    setTimeout(() => dateInputRef.current?.showPicker?.(), 50)
  }

  const handleDateSave = () => {
    if (editDate) {
      onDueDateChange(editDate)
    }
    setIsEditingDate(false)
  }

  const handleDateCancel = () => {
    setIsEditingDate(false)
  }

  return (
    <div className={`rounded-lg border border-l-4 bg-white p-3 sm:p-4 shadow-sm transition-shadow hover:shadow-md ${urgencyStyles[urgency]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {course && (
              <span
                className="inline-block h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: course.color }}
              />
            )}
            <span className="text-xs text-gray-500 truncate">{course?.name ?? '授業未設定'}</span>
          </div>
          <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">{assignment.title}</h3>
          {assignment.description && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 break-words">{assignment.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <StatusBadge status={assignment.status} />
            {assignment.dueDate && (
              <span className="text-xs text-gray-500">
                締切: {formatDate(assignment.dueDate)}
              </span>
            )}
            <span className={`text-xs font-medium ${
              urgency === 'urgent' ? 'text-red-600' :
              urgency === 'warning' ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {daysLabel}
            </span>
          </div>
          {assignment.dueDate && daysUntil <= 7 && assignment.status !== AssignmentStatus.COMPLETED && (
            <CountdownLabel dueDate={assignment.dueDate} />
          )}
          {isEditingDate && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={dateInputRef}
                type="date"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
              <Button size="sm" onClick={handleDateSave}>保存</Button>
              <Button variant="secondary" size="sm" onClick={handleDateCancel}>取消</Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenDateEdit}
              title="締切日を設定・変更"
            >
              📅
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} title="編集">
              ✏️
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} title="削除">
              🗑️
            </Button>
          </div>
          <div className="flex items-center gap-0.5">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange(status)}
                title={
                  status === AssignmentStatus.COMPLETED ? '完了にする' :
                  status === AssignmentStatus.IN_PROGRESS ? '進行中にする' : '未着手に戻す'
                }
              >
                {status === AssignmentStatus.COMPLETED ? '✓' :
                 status === AssignmentStatus.IN_PROGRESS ? '▶' : '↩'}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getCountdownText(dueDate: string): string {
  const now = new Date()
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999)
  const diffMs = due.getTime() - now.getTime()

  if (diffMs < 0) {
    const elapsed = Math.abs(diffMs)
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
    return `締切を ${days}日 ${hours}時間 ${minutes}分 超過`
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return `締切まで あと ${days}日 ${hours}時間 ${minutes}分`
}

function CountdownLabel({ dueDate }: { readonly dueDate: string }) {
  const [text, setText] = useState(() => getCountdownText(dueDate))

  useEffect(() => {
    setText(getCountdownText(dueDate))
    const id = setInterval(() => setText(getCountdownText(dueDate)), 60000)
    return () => clearInterval(id)
  }, [dueDate])

  return (
    <p className="mt-2 text-xs font-bold text-red-600">
      {text}
    </p>
  )
}
