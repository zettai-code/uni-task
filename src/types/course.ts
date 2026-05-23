import type { CourseId, CourseCategoryType, UserId } from './common'

export interface Course {
  readonly id: CourseId
  readonly userId: UserId
  readonly name: string
  readonly instructor: string
  readonly color: string
  readonly category: CourseCategoryType
  readonly subject: string
  readonly dayOfWeek: number
  readonly period: number
  readonly createdAt: string
}
