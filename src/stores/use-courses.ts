'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { generateCourseId } from '@/lib/id'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Course } from '@/types/course'
import type { CourseId, UserId } from '@/types/common'
import type { CreateCourseInput } from '@/schemas/course-schema'

export function useCourses(userId: UserId | undefined) {
  const [allCourses, setAllCourses, isLoaded] = useLocalStorage<readonly Course[]>(
    STORAGE_KEYS.COURSES,
    []
  )

  const courses = useMemo(
    () => (userId ? allCourses.filter((c) => c.userId === userId) : []),
    [allCourses, userId]
  )

  const addCourse = useCallback(
    (input: CreateCourseInput) => {
      if (!userId) return
      const newCourse: Course = {
        id: generateCourseId(),
        userId,
        ...input,
        createdAt: new Date().toISOString(),
      }
      setAllCourses((prev) => [...prev, newCourse])
    },
    [userId, setAllCourses]
  )

  const updateCourse = useCallback(
    (id: CourseId, input: Partial<CreateCourseInput>) => {
      setAllCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, ...input } : course
        )
      )
    },
    [setAllCourses]
  )

  const deleteCourse = useCallback(
    (id: CourseId) => {
      setAllCourses((prev) => prev.filter((course) => course.id !== id))
    },
    [setAllCourses]
  )

  const getCourseById = useCallback(
    (id: CourseId): Course | undefined => {
      return courses.find((c) => c.id === id)
    },
    [courses]
  )

  return {
    courses,
    isLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
  }
}
