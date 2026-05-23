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

function makeCourses(names: readonly string[], category: CourseCategoryType, colorOffset: number): CourseSeed[] {
  return names.map((s, i) => ({
    name: s, subject: s, category,
    color: COURSE_COLORS[(i + colorOffset) % COURSE_COLORS.length],
    dayOfWeek: (i % 5) + 1, period: (i % 7) + 1,
  }))
}

const ALL_COURSES: readonly CourseSeed[] = [
  // === 一般教養科目 ===
  ...makeCourses(['哲学', '倫理学', '心理学', '歴史学', '日本史', '世界史', '文学', '言語学', '宗教学', '美術史'], CourseCategory.GENERAL, 0),
  ...makeCourses(['経済学', '法学', '政治学', '社会学', '国際関係論', '経営学', '会計学', 'マーケティング', '教育学'], CourseCategory.GENERAL, 2),
  ...makeCourses(['数学', '統計学', '物理学', '化学', '生物学', '地学', '環境科学'], CourseCategory.GENERAL, 4),
  ...makeCourses(['情報リテラシー', 'プログラミング', 'AI基礎', 'データサイエンス', '情報倫理'], CourseCategory.GENERAL, 6),
  ...makeCourses(['英語', '第二外国語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語', 'ロシア語'], CourseCategory.GENERAL, 1),
  ...makeCourses(['スポーツ実技', '健康科学', '栄養学'], CourseCategory.GENERAL, 3),

  // === 語学科目 ===
  // 英語系
  ...makeCourses([
    '英語', '英会話', 'Academic English', 'English Communication',
    '英語リーディング', '英語ライティング', '英語リスニング',
    '英語プレゼンテーション', '英語ディベート',
    'TOEIC対策', 'TOEFL対策', 'IELTS対策',
    'ビジネス英語', '医学英語', '科学技術英語', '法律英語',
    '英語文法', '英語音声学', '英語学', '英米文化', '英文学',
  ], CourseCategory.LANGUAGE, 0),
  // ヨーロッパ系言語
  ...makeCourses([
    'フランス語', '初級フランス語', 'フランス会話', 'フランス文学', 'フランス文化',
    'ドイツ語', '初級ドイツ語', 'ドイツ会話', 'ドイツ文学',
    'スペイン語', '初級スペイン語', 'スペイン会話', 'ラテンアメリカ文化',
    'イタリア語', 'イタリア語会話', 'イタリア文化',
    'ロシア語', 'ロシア語文法', 'ロシア文学',
    'ポルトガル語', 'ブラジル文化', 'ポルトガル語会話',
    'オランダ語', 'ギリシャ語', '古代ギリシャ語', '現代ギリシャ語', 'ラテン語',
  ], CourseCategory.LANGUAGE, 1),
  // アジア系言語
  ...makeCourses([
    '中国語', '中国語会話', '中国語読解', '中国文化',
    '韓国語（朝鮮語）', '韓国語会話', '韓国文化',
    'アラビア語', 'アラビア語文法', '中東文化',
    'ヒンディー語', 'タイ語', 'ベトナム語', 'インドネシア語', 'マレー語',
    'モンゴル語', 'トルコ語', 'ペルシャ語', 'ウルドゥー語', 'タミル語',
    'ビルマ語（ミャンマー語）', 'ネパール語', 'カンボジア語（クメール語）', 'ラオス語',
  ], CourseCategory.LANGUAGE, 3),
  // アフリカ系言語
  ...makeCourses(['スワヒリ語', 'アムハラ語', 'ズールー語', 'ハウサ語'], CourseCategory.LANGUAGE, 5),
  // 北欧・東欧系言語
  ...makeCourses([
    'スウェーデン語', 'デンマーク語', 'ノルウェー語', 'フィンランド語', 'アイスランド語',
    'ポーランド語', 'チェコ語', 'ハンガリー語', 'ルーマニア語',
    'ブルガリア語', 'セルビア語', 'ウクライナ語',
  ], CourseCategory.LANGUAGE, 2),
  // 古典語・特殊言語
  ...makeCourses([
    '古典日本語', '漢文', 'サンスクリット語', '古典ラテン語', '聖書ヘブライ語',
  ], CourseCategory.LANGUAGE, 4),
  // 日本語教育系
  ...makeCourses([
    '日本語', '日本語会話', '日本語作文', 'ビジネス日本語', '日本語教育学',
  ], CourseCategory.LANGUAGE, 6),
  // 言語学系科目
  ...makeCourses([
    '言語学', '応用言語学', '社会言語学', '音声学', '音韻論',
    '統語論', '意味論', '第二言語習得論', '翻訳論', '通訳論',
  ], CourseCategory.LANGUAGE, 0),
  // 実践・専門語学
  ...makeCourses([
    '通訳演習', '翻訳演習', '観光英語', '航空英語',
    '医療通訳', '外交英語', 'ビジネス中国語',
  ], CourseCategory.LANGUAGE, 7),
  // 最近増えている語学関連
  ...makeCourses([
    'AI翻訳活用', '多文化コミュニケーション', '異文化理解',
    'グローバルコミュニケーション', 'オンライン英会話演習',
  ], CourseCategory.LANGUAGE, 5),
  // 学部ごとによくある語学
  ...makeCourses([
    '文学原書講読',
  ], CourseCategory.LANGUAGE, 3),
]

export default function SeedPage() {
  const { userId, isLoaded } = useAuth()
  const { courses, addCourse } = useCourses(userId)
  const [registered, setRegistered] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isLoaded || !userId || done) return

    const remaining = ALL_COURSES.filter(
      (item) => !courses.some((c) => c.name === item.name && c.subject === item.subject && c.category === item.category)
    )

    if (remaining.length === 0) {
      setRegistered(ALL_COURSES.length)
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
    setRegistered(ALL_COURSES.length - remaining.length + 1)
  }, [isLoaded, userId, courses, done, addCourse])

  if (!isLoaded) return <p className="p-8">読み込み中...</p>
  if (!userId) return <p className="p-8">先にログインしてください</p>
  if (done) return (
    <div className="p-8">
      <p className="text-lg font-bold text-green-600">{registered}件 の科目を登録しました</p>
      <a href="/courses" className="text-blue-600 underline mt-4 block">授業管理へ</a>
      <a href="/" className="text-blue-600 underline mt-2 block">ダッシュボードへ</a>
    </div>
  )
  return <p className="p-8">登録中... ({registered} / {ALL_COURSES.length})</p>
}
