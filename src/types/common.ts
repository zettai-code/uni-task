export type CourseId = string & { readonly __brand: 'CourseId' }
export type AssignmentId = string & { readonly __brand: 'AssignmentId' }
export type UserId = string & { readonly __brand: 'UserId' }

export const AssignmentStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const

export type AssignmentStatusType =
  (typeof AssignmentStatus)[keyof typeof AssignmentStatus]
