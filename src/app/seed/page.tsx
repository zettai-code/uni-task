'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { CourseCategory } from '@/types/common'
import { COURSE_COLORS } from '@/lib/constants'
import type { CourseCategoryType } from '@/types/common'

interface CourseSeed {
  readonly name: string
  readonly subject: string
  readonly category: CourseCategoryType
  readonly color: string
  readonly dayOfWeek: number
  readonly period: number
}

const GENERAL_COURSES: readonly CourseSeed[] = [
  // 人文系
  ...['哲学', '倫理学', '心理学', '歴史学', '日本史', '世界史', '文学', '言語学', '宗教学', '美術史'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[i % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 1,
  })),
  // 社会科学系
  ...['経済学', '法学', '政治学', '社会学', '国際関係論', '経営学', '会計学', 'マーケティング', '教育学'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[(i + 2) % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 2,
  })),
  // 自然科学系
  ...['数学', '統計学', '物理学', '化学', '生物学', '地学', '環境科学'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[(i + 4) % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 1,
  })),
  // 情報・データ系
  ...['情報リテラシー', 'プログラミング', 'AI基礎', 'データサイエンス', '情報倫理'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[(i + 6) % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 3,
  })),
  // 言語系
  ...['英語', '第二外国語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語', 'ロシア語'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[(i + 1) % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 2,
  })),
  // 健康・体育系
  ...['スポーツ実技', '健康科学', '栄養学'].map((s, i) => ({
    name: s, subject: s, category: CourseCategory.GENERAL as CourseCategoryType,
    color: COURSE_COLORS[(i + 3) % COURSE_COLORS.length], dayOfWeek: (i % 5) + 1, period: (i % 5) + 4,
  })),
]

export default function SeedPage() {
  const { userId, isLoaded } = useAuth()
  const { courses, addCourse } = useCourses(userId)
  const [registered, setRegistered] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoaded || !userId || done) return

    const remaining = GENERAL_COURSES.filter(
      (item) => !courses.some((c) => c.name === item.name && c.subject === item.subject)
    )

    if (remaining.length === 0) {
      setRegistered(GENERAL_COURSES.length)
      setDone(true)
      return
    }

    addCourse({
      name: remaining[0].name,
      instructor: '',
      color: remaining[0].color,
      category: remaining[0].category,
      subject: remaining[0].subject,
      dayOfWeek: remaining[0].dayOfWeek,
      period: remaining[0].period,
    })
    setRegistered(GENERAL_COURSES.length - remaining.length + 1)
  }, [isLoaded, userId, courses, done, addCourse])

  if (!isLoaded) return <p className="p-8">読み込み中...</p>
  if (!userId) return <p className="p-8">先にログインしてください</p>
  if (done) return (
    <div className="p-8">
      <p className="text-lg font-bold text-green-600">一般教養科目 {registered}件 を登録しました</p>
      <a href="/courses" className="text-blue-600 underline mt-4 block">授業管理へ</a>
      <a href="/" className="text-blue-600 underline mt-2 block">ダッシュボードへ</a>
    </div>
  )
  return <p className="p-8">登録中... ({registered} / {GENERAL_COURSES.length})</p>
}
