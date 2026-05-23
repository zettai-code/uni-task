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

export const CourseCategory = {
  GENERAL: 'general',
  LANGUAGE: 'language',
  SPECIALIZED: 'specialized',
  SEMINAR: 'seminar',
  LAB: 'lab',
  SPORTS: 'sports',
  CERTIFICATION: 'certification',
  CAREER: 'career',
  ONLINE_PBL: 'online_pbl',
} as const

export type CourseCategoryType =
  (typeof CourseCategory)[keyof typeof CourseCategory]
