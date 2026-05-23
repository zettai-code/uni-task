import type { AssignmentId, CourseId, UserId } from '@/types/common'

export function generateCourseId(): CourseId {
  return crypto.randomUUID() as CourseId
}

export function generateAssignmentId(): AssignmentId {
  return crypto.randomUUID() as AssignmentId
}

export function generateUserId(): UserId {
  return crypto.randomUUID() as UserId
}
