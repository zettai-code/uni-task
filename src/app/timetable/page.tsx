'use client'

import { useMemo } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { DAY_LABELS, PERIOD_LABELS } from '@/lib/constants'
import { AssignmentStatus } from '@/types/common'
import type { Course } from '@/types/course'

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0] as const // 月〜土, 日

export default function TimetablePage() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments } = useAssignments(userId)

  const grid = useMemo(() => {
    const map = new Map<string, Course>()
    for (const course of courses) {
      const key = `${course.dayOfWeek}-${course.period}`
      map.set(key, course)
    }
    return map
  }, [courses])

  const getAssignmentCount = (courseId: string) => {
    return assignments.filter(
      (a) => a.courseId === courseId && a.status !== AssignmentStatus.COMPLETED
    ).length
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">タイムテーブル</h1>

      <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-r bg-gray-50 px-2 py-3 text-xs font-medium text-gray-500 w-16">
                時限
              </th>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  className={`border-b border-r last:border-r-0 bg-gray-50 px-2 py-3 text-sm font-medium ${
                    day === 0 ? 'text-red-500' : day === 6 ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  {DAY_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIOD_LABELS.map((periodLabel, periodIndex) => {
              const period = periodIndex + 1
              return (
                <tr key={period}>
                  <td className="border-b border-r bg-gray-50 px-2 py-1 text-center text-xs font-medium text-gray-500">
                    {periodLabel}
                  </td>
                  {WEEKDAYS.map((day) => {
                    const course = grid.get(`${day}-${period}`)
                    const count = course ? getAssignmentCount(course.id) : 0

                    return (
                      <td
                        key={day}
                        className="border-b border-r last:border-r-0 p-1 h-[72px] align-top"
                      >
                        {course ? (
                          <div
                            className="h-full rounded-md p-1.5 text-white text-xs flex flex-col justify-between"
                            style={{ backgroundColor: course.color }}
                          >
                            <div>
                              <p className="font-bold leading-tight truncate">{course.name}</p>
                              {course.instructor && (
                                <p className="opacity-80 text-[10px] truncate mt-0.5">{course.instructor}</p>
                              )}
                            </div>
                            {count > 0 && (
                              <p className="text-[10px] bg-white/25 rounded px-1 py-0.5 mt-1 w-fit">
                                未完了 {count}件
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="h-full" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-3">登録済み授業一覧</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-gray-400">授業が登録されていません。授業管理から追加してください。</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
              >
                <span
                  className="inline-block h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: course.color }}
                />
                <span className="text-gray-700">{course.name}</span>
                <span className="text-xs text-gray-400">
                  {DAY_LABELS[course.dayOfWeek]}{PERIOD_LABELS[course.period - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
