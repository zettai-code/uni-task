'use client'

import { useMemo } from 'react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AssignmentStatus, CourseCategory } from '@/types/common'
import { STATUS_CONFIG, CATEGORY_CONFIG, CATEGORY_SUBJECT_GROUPS } from '@/lib/constants'
import type { AssignmentFilters } from '@/types/assignment'
import type { Course } from '@/types/course'
import type { AssignmentStatusType, CourseCategoryType, CourseId } from '@/types/common'

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

  const categoryOptions = Object.values(CourseCategory).map((c) => ({
    value: c,
    label: CATEGORY_CONFIG[c].label,
  }))

  const subjectGroups = useMemo(() => {
    if (!filters.category) return []
    return CATEGORY_SUBJECT_GROUPS[filters.category] ?? []
  }, [filters.category])

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-48">
        <Select
          label="科目区分"
          options={categoryOptions}
          placeholder="すべて"
          value={filters.category ?? ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              category: e.target.value ? (e.target.value as CourseCategoryType) : null,
              subject: null,
            })
          }
        />
      </div>
      <div className="w-48">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">科目</label>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.subject ?? ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                subject: e.target.value || null,
              })
            }
          >
            <option value="">{filters.category ? 'すべて' : '科目区分を選択してください'}</option>
            {subjectGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
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
