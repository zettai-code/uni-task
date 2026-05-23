'use client'

import { useMemo } from 'react'
import { getDaysUntilDue } from '@/lib/date-utils'
import { REMINDER_THRESHOLDS } from '@/lib/constants'
import { AssignmentStatus } from '@/types/common'
import type { Assignment } from '@/types/assignment'

export interface Reminder {
  readonly assignment: Assignment
  readonly daysUntil: number
  readonly level: 'urgent' | 'warning' | 'info'
}

export function useReminders(assignments: readonly Assignment[]): readonly Reminder[] {
  return useMemo(() => {
    const reminders: Reminder[] = []

    for (const assignment of assignments) {
      if (assignment.status === AssignmentStatus.COMPLETED) continue

      const daysUntil = getDaysUntilDue(assignment.dueDate)

      if (daysUntil <= REMINDER_THRESHOLDS.URGENT) {
        reminders.push({ assignment, daysUntil, level: 'urgent' })
      } else if (daysUntil <= REMINDER_THRESHOLDS.WARNING) {
        reminders.push({ assignment, daysUntil, level: 'warning' })
      } else if (daysUntil <= REMINDER_THRESHOLDS.INFO) {
        reminders.push({ assignment, daysUntil, level: 'info' })
      }
    }

    return reminders.sort((a, b) => a.daysUntil - b.daysUntil)
  }, [assignments])
}
