'use client'

import { useState, type FormEvent } from 'react'
import { createCourseSchema } from '@/schemas/course-schema'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { COURSE_COLORS, DAY_LABELS, PERIOD_LABELS } from '@/lib/constants'
import type { Course } from '@/types/course'

interface CourseFormProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSubmit: (data: { name: string; instructor: string; color: string; dayOfWeek: number; period: number }) => void
  readonly editTarget?: Course
}

export function CourseForm({ isOpen, onClose, onSubmit, editTarget }: CourseFormProps) {
  const [name, setName] = useState(editTarget?.name ?? '')
  const [instructor, setInstructor] = useState(editTarget?.instructor ?? '')
  const [color, setColor] = useState(editTarget?.color ?? COURSE_COLORS[0])
  const [dayOfWeek, setDayOfWeek] = useState(editTarget?.dayOfWeek ?? 1)
  const [period, setPeriod] = useState(editTarget?.period ?? 1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = createCourseSchema.safeParse({ name, instructor, color, dayOfWeek, period })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    onSubmit({ name, instructor, color, dayOfWeek, period })
    onClose()
  }

  const dayOptions = DAY_LABELS.map((label, i) => ({
    value: String(i),
    label,
  }))

  const periodOptions = PERIOD_LABELS.map((label, i) => ({
    value: String(i + 1),
    label,
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTarget ? '授業を編集' : '授業を追加'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="授業名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="例: 線形代数I"
        />
        <Input
          label="担当教員"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          error={errors.instructor}
          placeholder="例: 山田太郎"
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              label="曜日"
              options={dayOptions}
              value={String(dayOfWeek)}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <Select
              label="時限"
              options={periodOptions}
              value={String(period)}
              onChange={(e) => setPeriod(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">色</label>
          <div className="flex gap-2">
            {COURSE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit">
            {editTarget ? '更新' : '追加'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
