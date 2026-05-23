'use client'

import { useState } from 'react'
import { CalendarHeader } from './calendar-header'
import { CalendarEvent } from './calendar-event'
import { getDaysInMonth, getFirstDayOfMonth, isSameDay } from '@/lib/date-utils'
import { DAY_LABELS } from '@/lib/constants'
import type { Assignment } from '@/types/assignment'
import type { Course } from '@/types/course'

interface CalendarGridProps {
  readonly assignments: readonly Assignment[]
  readonly courses: readonly Course[]
}

export function CalendarGrid({ assignments, courses }: CalendarGridProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else {
      setMonth(month - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else {
      setMonth(month + 1)
    }
  }

  const goToToday = () => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  const getAssignmentsForDate = (day: number) => {
    const date = new Date(year, month, day)
    return assignments.filter((a) => isSameDay(new Date(a.dueDate), date))
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

            return (
              <div
                key={i}
                className={`min-h-[100px] border-b border-r p-1 ${
                  day === null ? 'bg-gray-50' : ''
                }`}
              >
                {day !== null && (
                  <>
                    <div className="mb-1">
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
                    </div>
                    <div className="space-y-0.5">
                      {dayAssignments.slice(0, 3).map((assignment) => (
                        <CalendarEvent
                          key={assignment.id}
                          assignment={assignment}
                          course={courses.find((c) => c.id === assignment.courseId)}
                        />
                      ))}
                      {dayAssignments.length > 3 && (
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
