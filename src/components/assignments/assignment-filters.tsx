'use client'

import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AssignmentStatus } from '@/types/common'
import { STATUS_CONFIG } from '@/lib/constants'
import type { AssignmentFilters } from '@/types/assignment'
import type { Course } from '@/types/course'
import type { AssignmentStatusType, CourseId } from '@/types/common'

interface AssignmentFiltersProps {
  readonly filters: AssignmentFilters
  readonly courses: readonly Course[]
  readonly onFilterChange: (filters: AssignmentFilters) => void
}

export function AssignmentFiltersBar({ filters, courses, onFilterChange }: AssignmentFiltersProps) {
  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const statusOptions = Object.values(AssignmentStatus).map((s) => ({
    value: s,
    label: STATUS_CONFIG[s].label,
  }))

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-48">
        <Select
          label="授業で絞り込み"
          options={courseOptions}
          placeholder="すべて"
          value={filters.courseId ?? ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              courseId: e.target.value ? (e.target.value as CourseId) : null,
            })
          }
        />
      </div>
      <div className="w-40">
        <Select
          label="ステータス"
          options={statusOptions}
          placeholder="すべて"
          value={filters.status ?? ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value ? (e.target.value as AssignmentStatusType) : null,
            })
          }
        />
      </div>
      <div className="w-56">
        <Input
          label="検索"
          placeholder="課題名で検索..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
        />
      </div>
    </div>
  )
}
