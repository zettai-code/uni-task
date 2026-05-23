'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CourseCategory } from '@/types/common'

export default function SeedPage() {
  const { userId, isLoaded } = useAuth()
  const { courses, addCourse } = useCourses(userId)
  const { addAssignment } = useAssignments(userId)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoaded || !userId || done) return

    const existingCourse = courses.find((c) => c.name === '日本史' && c.subject === '日本史')
    if (existingCourse) {
      addAssignment({
        courseId: existingCourse.id,
        title: '日本史課題１',
        description: '',
        dueDate: '2026-06-06',
      })
      setDone(true)
      return
    }

    addCourse({
      name: '日本史',
      instructor: '',
      color: '#F59E0B',
      category: CourseCategory.GENERAL,
      subject: '日本史',
      dayOfWeek: 2,
      period: 1,
    })
  }, [isLoaded, userId, courses, done, addCourse, addAssignment])

  if (!isLoaded) return <p>読み込み中...</p>
  if (!userId) return <p>先にログインしてください</p>
  if (done) return <p>「日本史」の授業と「日本史課題１」を追加しました。<a href="/" className="text-blue-600 underline">ダッシュボードへ</a></p>
  return <p>データ登録中...</p>
}
