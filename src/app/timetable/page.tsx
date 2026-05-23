'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CourseForm } from '@/components/courses/course-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import { DAY_LABELS, PERIOD_LABELS } from '@/lib/constants'
import { AssignmentStatus } from '@/types/common'
import type { Course } from '@/types/course'
import type { CourseId, CourseCategoryType } from '@/types/common'

const WEEKDAYS = [1, 2, 3, 4, 5, 6] as const

const PERIODS = [1, 2, 3, 4, 5, 6] as const

const PERIOD_TIMES = [
  '8:50~10:30',
  '10:45~12:25',
  '13:25~15:05',
  '15:20~17:00',
  '17:10~18:50',
  '18:55~20:35',
] as const

interface SelectedCell {
  readonly day: number
  readonly period: number
}

export default function TimetablePage() {
  const { userId } = useAuth()
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses(userId)
  const { assignments, deleteAssignmentsByCourse } = useAssignments(userId)

  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Course | undefined>()
  const [deleteTargetId, setDeleteTargetId] = useState<CourseId | null>(null)

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

  const handleCellClick = (day: number, period: number) => {
    const key = `${day}-${period}`
    if (selectedCell?.day === day && selectedCell?.period === period) {
      setSelectedCell(null)
    } else {
      setSelectedCell({ day, period })
    }
  }

  const handleAdd = (day: number, period: number) => {
    setEditTarget(undefined)
    setSelectedCell(null)
    setIsFormOpen(true)
    setPrefillDay(day)
    setPrefillPeriod(period)
  }

  const handleEdit = (course: Course) => {
    setEditTarget(course)
    setSelectedCell(null)
    setIsFormOpen(true)
  }

  const handleDelete = (id: CourseId) => {
    setSelectedCell(null)
    setDeleteTargetId(id)
  }

  const [prefillDay, setPrefillDay] = useState(1)
  const [prefillPeriod, setPrefillPeriod] = useState(1)

  const handleSubmit = (data: { name: string; instructor: string; color: string; category: CourseCategoryType; subject: string; dayOfWeek: number; period: number }) => {
    if (editTarget) {
      updateCourse(editTarget.id, data)
    } else {
      addCourse(data)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteAssignmentsByCourse(deleteTargetId)
      deleteCourse(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  const deleteTargetCourse = deleteTargetId ? courses.find((c) => c.id === deleteTargetId) : null
  const deleteAssignmentCount = deleteTargetId
    ? assignments.filter((a) => a.courseId === deleteTargetId).length
    : 0

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
                  className={`border-b border-r last:border-r-0 bg-gray-50 px-2 py-3 text-sm font-medium w-[14%] ${
                    day === 6 ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  {DAY_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, periodIndex) => (
                <tr key={period}>
                  <td className="border-b border-r bg-gray-50 px-2 py-1 text-center">
                    <div className="text-xs font-medium text-gray-500">{PERIOD_LABELS[periodIndex]}</div>
                    <div className="text-[10px] font-medium text-red-500 mt-0.5">{PERIOD_TIMES[periodIndex]}</div>
                  </td>
                  {WEEKDAYS.map((day) => {
                    const course = grid.get(`${day}-${period}`)
                    const count = course ? getAssignmentCount(course.id) : 0
                    const isSelected = selectedCell?.day === day && selectedCell?.period === period

                    return (
                      <td
                        key={day}
                        className={`border-b border-r last:border-r-0 p-1 h-[72px] align-top cursor-pointer transition-colors ${
                          isSelected ? 'ring-2 ring-inset ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCellClick(day, period)}
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
                            {isSelected ? (
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEdit(course) }}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/30 hover:bg-white/50"
                                >
                                  変更
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(course.id) }}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/30 hover:bg-white/50"
                                >
                                  削除
                                </button>
                              </div>
                            ) : count > 0 ? (
                              <p className="text-[10px] bg-white/25 rounded px-1 py-0.5 mt-1 w-fit">
                                未完了 {count}件
                              </p>
                            ) : null}
                          </div>
                        ) : isSelected ? (
                          <div className="h-full flex items-center justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAdd(day, period) }}
                              className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                              + 追加
                            </button>
                          </div>
                        ) : (
                          <div className="h-full" />
                        )}
                      </td>
                    )
                  })}
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-3">登録済み授業一覧</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-gray-400">授業が登録されていません。セルをクリックして追加してください。</p>
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

      <CourseForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditTarget(undefined) }}
        onSubmit={handleSubmit}
        editTarget={editTarget}
      />

      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="授業を削除"
        message={
          deleteTargetCourse
            ? `「${deleteTargetCourse.name}」を削除してもよろしいですか？${
                deleteAssignmentCount > 0
                  ? `関連する課題${deleteAssignmentCount}件も一緒に削除されます。`
                  : ''
              }この操作は取り消せません。`
            : ''
        }
      />
    </div>
  )
}
