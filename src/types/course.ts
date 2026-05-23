import type { CourseId, UserId } from './common'

export interface Course {
  readonly id: CourseId
  readonly userId: UserId
  readonly name: string
  readonly instructor: string
  readonly color: string
  readonly dayOfWeek: number
  readonly period: number
  readonly createdAt: string
}
