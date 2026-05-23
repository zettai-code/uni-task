'use client'

import { useState, type FormEvent } from 'react'
import { createAssignmentSchema } from '@/schemas/assignment-schema'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import type { Course } from '@/types/course'
import type { Assignment } from '@/types/assignment'
import type { CourseId } from '@/types/common'
import { formatDateForInput } from '@/lib/date-utils'

interface AssignmentFormProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSubmit: (data: { courseId: string; title: string; description: string; dueDate: string }) => void
  readonly courses: readonly Course[]
  readonly editTarget?: Assignment
}

export function AssignmentForm({ isOpen, onClose, onSubmit, courses, editTarget }: AssignmentFormProps) {
  const [courseId, setCourseId] = useState(editTarget?.courseId ?? '')
  const [title, setTitle] = useState(editTarget?.title ?? '')
  const [description, setDescription] = useState(editTarget?.description ?? '')
  const [dueDate, setDueDate] = useState(editTarget ? formatDateForInput(editTarget.dueDate) : '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = createAssignmentSchema.safeParse({ courseId, title, description, dueDate })
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

    onSubmit({ courseId, title, description, dueDate })
    onClose()
  }

  const courseOptions = courses.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editTarget ? '課題を編集' : '課題を追加'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="授業"
          options={courseOptions}
          placeholder="授業を選択"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value as CourseId)}
          error={errors.courseId}
        />
        <Input
          label="課題名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="例: レポート第3回"
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">説明</label>
          <textarea
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="課題の詳細（任意）"
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>
        <Input
          label="締切日"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />
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
