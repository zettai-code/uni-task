'use client'

import { useEffect, useCallback } from 'react'
import { getDaysUntilDue } from '@/lib/date-utils'
import { AssignmentStatus } from '@/types/common'
import { readStorage, writeStorage } from '@/lib/storage'
import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'

const NOTIFIED_KEY = 'uni-task-notified'

interface NotifiedRecord {
  readonly [assignmentId: string]: string // last notified date (YYYY-MM-DD)
}

function getTodayStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function useNotification(
  assignments: readonly Assignment[],
  courses: readonly Course[]
) {
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const checkAndNotify = async () => {
      const permitted = await requestPermission()
      if (!permitted) return

      const todayStr = getTodayStr()
      const notified = readStorage<NotifiedRecord>(NOTIFIED_KEY) ?? {}
      const updatedNotified = { ...notified }

      const urgentAssignments = assignments.filter((a) => {
        if (a.status === AssignmentStatus.COMPLETED) return false
        if (!a.dueDate) return false
        const daysUntil = getDaysUntilDue(a.dueDate)
        if (daysUntil > 7) return false
        if (notified[a.id] === todayStr) return false
        return true
      })

      for (const assignment of urgentAssignments) {
        const daysUntil = getDaysUntilDue(assignment.dueDate)
        const course = courses.find((c) => c.id === assignment.courseId)
        const courseName = course?.name ?? '未設定'

        const daysLabel =
          daysUntil < 0
            ? `${Math.abs(daysUntil)}日超過`
            : daysUntil === 0
              ? '今日が締切'
              : `あと${daysUntil}日`

        new Notification('未完了の課題あり', {
          body: `${courseName}${assignment.title ? ` - ${assignment.title}` : ''}\n締切: ${daysLabel}`,
          icon: '/favicon.ico',
          tag: assignment.id,
        })

        updatedNotified[assignment.id] = todayStr
      }

      if (urgentAssignments.length > 0) {
        writeStorage(NOTIFIED_KEY, updatedNotified)
      }
    }

    const timeoutId = setTimeout(checkAndNotify, 2000)

    const intervalId = setInterval(checkAndNotify, 60 * 60 * 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [assignments, courses, requestPermission])
}
