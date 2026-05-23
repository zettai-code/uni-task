'use client'

import { STATUS_CONFIG } from '@/lib/constants'
import type { AssignmentStatusType } from '@/types/common'

interface StatusBadgeProps {
  readonly status: AssignmentStatusType
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  )
}
