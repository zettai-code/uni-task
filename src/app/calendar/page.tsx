'use client'

import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CalendarGrid } from '@/components/calendar/calendar-grid'

export default function CalendarPage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments } = useAssignments(userId)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>
      <CalendarGrid assignments={assignments} courses={courses} />
    </div>
  )
}
