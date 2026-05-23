'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { generateAssignmentId } from '@/lib/id'
import { STORAGE_KEYS } from '@/lib/constants'
import { AssignmentStatus } from '@/types/common'
import type { Assignment } from '@/types/assignment'
import type { AssignmentId, AssignmentStatusType, CourseId, UserId } from '@/types/common'
import type { CreateAssignmentInput } from '@/schemas/assignment-schema'

export function useAssignments(userId: UserId | undefined) {
  const [allAssignments, setAllAssignments, isLoaded] = useLocalStorage<readonly Assignment[]>(
    STORAGE_KEYS.ASSIGNMENTS,
    []
  )

  const assignments = useMemo(
    () => (userId ? allAssignments.filter((a) => a.userId === userId) : []),
    [allAssignments, userId]
  )

  const addAssignment = useCallback(
    (input: CreateAssignmentInput) => {
      if (!userId) return
      const now = new Date().toISOString()
      const newAssignment: Assignment = {
        id: generateAssignmentId(),
        userId,
        courseId: input.courseId as CourseId,
        title: input.title,
        description: input.description ?? '',
        dueDate: input.dueDate,
        status: AssignmentStatus.NOT_STARTED,
        createdAt: now,
        updatedAt: now,
      }
      setAllAssignments((prev) => [...prev, newAssignment])
    },
    [userId, setAllAssignments]
  )

  const updateAssignment = useCallback(
    (id: AssignmentId, input: Partial<CreateAssignmentInput>) => {
      setAllAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id
            ? {
                ...assignment,
                ...input,
                ...(input.courseId ? { courseId: input.courseId as CourseId } : {}),
                updatedAt: new Date().toISOString(),
              }
            : assignment
        )
      )
    },
    [setAllAssignments]
  )

  const updateStatus = useCallback(
    (id: AssignmentId, status: AssignmentStatusType) => {
      setAllAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id
            ? { ...assignment, status, updatedAt: new Date().toISOString() }
            : assignment
        )
      )
    },
    [setAllAssignments]
  )

  const deleteAssignment = useCallback(
    (id: AssignmentId) => {
      setAllAssignments((prev) => prev.filter((a) => a.id !== id))
    },
    [setAllAssignments]
  )

  const deleteAssignmentsByCourse = useCallback(
    (courseId: CourseId) => {
      setAllAssignments((prev) => prev.filter((a) => a.courseId !== courseId))
    },
    [setAllAssignments]
  )

  return {
    assignments,
    isLoaded,
    addAssignment,
    updateAssignment,
    updateStatus,
    deleteAssignment,
    deleteAssignmentsByCourse,
  }
}
