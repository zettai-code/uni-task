'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { CourseCategory } from '@/types/common'

interface SeedItem {
  readonly courseName: string
  readonly subject: string
  readonly category: (typeof CourseCategory)[keyof typeof CourseCategory]
  readonly color: string
  readonly assignmentTitle: string
}

const SEED_ITEMS: readonly SeedItem[] = [
  {
    courseName: '英語リーディング',
    subject: '英語リーディング',
    category: CourseCategory.LANGUAGE,
    color: '#3B82F6',
    assignmentTitle: '英語リーディングの課題１',
  },
]

export default function SeedPage() {
  const { userId, isLoaded } = useAuth()
  const { courses, addCourse } = useCourses(userId)
  const { addAssignment } = useAssignments(userId)
  const [results, setResults] = useState<readonly string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoaded || !userId || done) return

    const newResults: string[] = []

    for (const item of SEED_ITEMS) {
      const existing = courses.find(
        (c) => c.name === item.courseName && c.subject === item.subject
      )

      if (existing) {
        addAssignment({
          courseId: existing.id,
          title: item.assignmentTitle,
          description: '',
          dueDate: '2026-06-13',
        })
        newResults.push(`「${item.courseName}」に「${item.assignmentTitle}」を追加`)
      } else {
        addCourse({
          name: item.courseName,
          instructor: '',
          color: item.color,
          category: item.category,
          subject: item.subject,
          dayOfWeek: 3,
          period: 2,
        })
        return
      }
    }

    setResults(newResults)
    setDone(true)
  }, [isLoaded, userId, courses, done, addCourse, addAssignment])

  if (!isLoaded) return <p>読み込み中...</p>
  if (!userId) return <p>先にログインしてください</p>
  if (done) return (
    <div className="p-8">
      {results.map((r, i) => <p key={i}>{r}</p>)}
      <a href="/" className="text-blue-600 underline mt-4 block">ダッシュボードへ</a>
    </div>
  )
  return <p className="p-8">データ登録中...</p>
}
