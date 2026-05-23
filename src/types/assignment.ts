import type {
  AssignmentId,
  AssignmentStatusType,
  CourseId,
  UserId,
} from './common'

export interface Assignment {
  readonly id: AssignmentId
  readonly userId: UserId
  readonly courseId: CourseId
  readonly title: string
  readonly description: string
  readonly dueDate: string
  readonly status: AssignmentStatusType
  readonly createdAt: string
  readonly updatedAt: string
}

import type { CourseCategoryType } from './common'

export interface AssignmentFilters {
  readonly courseId: CourseId | null
  readonly status: AssignmentStatusType | null
  readonly category: CourseCategoryType | null
  readonly subject: string | null
  readonly searchQuery: string
}
