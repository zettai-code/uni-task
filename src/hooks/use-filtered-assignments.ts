'use client'

import { useMemo } from 'react'
import type { Assignment, AssignmentFilters } from '@/types/assignment'
import type { Course } from '@/types/course'

export function useFilteredAssignments(
  assignments: readonly Assignment[],
  filters: AssignmentFilters,
  courses: readonly Course[] = []
) {
  return useMemo(() => {
    const filtered = assignments.filter((assignment) => {
      if (filters.courseId && assignment.courseId !== filters.courseId) {
        return false
      }
      if (filters.status && assignment.status !== filters.status) {
        return false
      }
      if (filters.category) {
        const course = courses.find((c) => c.id === assignment.courseId)
        if (!course || course.category !== filters.category) {
          return false
        }
      }
      if (
        filters.searchQuery &&
        !assignment.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })

    return [...filtered].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  }, [assignments, filters, courses])
}
