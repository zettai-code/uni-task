'use client'

import { useState } from 'react'
import type { Reminder } from '@/hooks/use-reminders'
import type { Course } from '@/types/course'

interface ReminderToastProps {
  readonly reminders: readonly Reminder[]
  readonly courses: readonly Course[]
}

const levelStyles = {
  urgent: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
} as const

export function ReminderToast({ reminders, courses }: ReminderToastProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || reminders.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-3 py-2">
        <span className="text-sm font-medium text-white">
          締切が近い課題 ({reminders.length}件)
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
        {reminders.slice(0, 5).map((reminder) => {
          const course = courses.find((c) => c.id === reminder.assignment.courseId)
          return (
            <div
              key={reminder.assignment.id}
              className={`rounded-lg border px-3 py-2 text-sm ${levelStyles[reminder.level]}`}
            >
              <div className="font-medium">{reminder.assignment.title}</div>
              <div className="flex items-center gap-2 text-xs opacity-75">
                <span>{course?.name}</span>
                <span>
                  {reminder.daysUntil < 0
                    ? `${Math.abs(reminder.daysUntil)}日超過`
                    : reminder.daysUntil === 0
                      ? '今日が締切'
                      : `あと${reminder.daysUntil}日`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
