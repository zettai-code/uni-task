import { AssignmentStatus } from '@/types/common'

export const STORAGE_KEYS = {
  USERS: 'uni-task-users',
  SESSION: 'uni-task-session',
  COURSES: 'uni-task-courses',
  ASSIGNMENTS: 'uni-task-assignments',
} as const

export const STATUS_CONFIG = {
  [AssignmentStatus.NOT_STARTED]: {
    label: '未着手',
    color: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400',
  },
  [AssignmentStatus.IN_PROGRESS]: {
    label: '進行中',
    color: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-400',
  },
  [AssignmentStatus.COMPLETED]: {
    label: '完了',
    color: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-400',
  },
} as const

export const REMINDER_THRESHOLDS = {
  URGENT: 1,
  WARNING: 3,
  INFO: 7,
} as const

export const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

export const PERIOD_LABELS = ['1限', '2限', '3限', '4限', '5限', '6限', '7限'] as const

export const COURSE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
] as const
