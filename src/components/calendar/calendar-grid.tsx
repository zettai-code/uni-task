'use client'

import { useState } from 'react'
import { CalendarHeader } from './calendar-header'
import { CalendarEvent } from './calendar-event'
import { Button } from '@/components/ui/button'
import { getDaysInMonth, getFirstDayOfMonth, isSameDay } from '@/lib/date-utils'
import { DAY_LABELS } from '@/lib/constants'
import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'
import type { AssignmentId } from '@/types/common'

interface CalendarGridProps {
  readonly assignments: readonly Assignment[]
  readonly courses: readonly Course[]
  readonly onAddAssignment: (dateStr: string) => void
  readonly onEditAssignment: (assignment: Assignment) => void
  readonly onDeleteAssignment: (id: AssignmentId) => void
  readonly onMonthChange?: (year: number, month: number) => void
}

export function CalendarGrid({
  assignments,
  courses,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onMonthChange,
}: CalendarGridProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setSelectedDay(null)
    const newMonth = month === 0 ? 11 : month - 1
    const newYear = month === 0 ? year - 1 : year
    setYear(newYear)
    setMonth(newMonth)
    onMonthChange?.(newYear, newMonth)
  }

  const nextMonth = () => {
    setSelectedDay(null)
    const newMonth = month === 11 ? 0 : month + 1
    const newYear = month === 11 ? year + 1 : year
    setYear(newYear)
    setMonth(newMonth)
    onMonthChange?.(newYear, newMonth)
  }

  const goToToday = () => {
    setSelectedDay(null)
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    onMonthChange?.(today.getFullYear(), today.getMonth())
  }

  const getAssignmentsForDate = (day: number) => {
    const date = new Date(year, month, day)
    return assignments.filter((a) => a.dueDate && isSameDay(new Date(a.dueDate), date))
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day)
  }

  const handleAdd = () => {
    if (selectedDay === null) return
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    onAddAssignment(dateStr)
    setSelectedDay(null)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToToday}
      />
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {DAY_LABELS.map((label, i) => (
            <div
              key={label}
              className={`p-2 text-center text-sm font-medium ${
                i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const isToday = day !== null && isSameDay(new Date(year, month, day), today)
            const dayAssignments = day !== null ? getAssignmentsForDate(day) : []
            const dayOfWeek = i % 7
            const isSelected = day !== null && selectedDay === day

            return (
              <div
                key={i}
                className={`min-h-[60px] sm:min-h-[100px] border-b border-r p-0.5 sm:p-1 transition-colors ${
                  day === null
                    ? 'bg-gray-50'
                    : isSelected
                      ? 'bg-blue-50 ring-2 ring-inset ring-blue-400'
                      : 'cursor-pointer hover:bg-gray-50'
                }`}
                onClick={() => day !== null && handleDayClick(day)}
              >
                {day !== null && (
                  <>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                          isToday
                            ? 'bg-blue-600 text-white font-bold'
                            : dayOfWeek === 0
                              ? 'text-red-500'
                              : dayOfWeek === 6
                                ? 'text-blue-500'
                                : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </span>
                      {isSelected && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAdd() }}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          + 追加
                        </button>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayAssignments.slice(0, isSelected ? 10 : 3).map((assignment) => (
                        <div key={assignment.id} className="group relative">
                          <CalendarEvent
                            assignment={assignment}
                            course={courses.find((c) => c.id === assignment.courseId)}
                          />
                          {isSelected && (
                            <div className="flex gap-1 mt-0.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); onEditAssignment(assignment) }}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                              >
                                編集
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteAssignment(assignment.id) }}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                削除
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {!isSelected && dayAssignments.length > 3 && (
                        <p className="text-xs text-gray-400 px-1">
                          +{dayAssignments.length - 3}件
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
