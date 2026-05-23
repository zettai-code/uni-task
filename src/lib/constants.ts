import { AssignmentStatus, CourseCategory } from '@/types/common'

export const STORAGE_KEYS = {
  USERS: 'uni-task-users',
  SESSION: 'uni-task-session',
  COURSES: 'uni-task-courses',
  ASSIGNMENTS: 'uni-task-assignments',
} as const

export const STATUS_CONFIG = {
  [AssignmentStatus.NOT_STARTED]: {
    label: '未着手',
    color: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400',
  },
  [AssignmentStatus.IN_PROGRESS]: {
    label: '進行中',
    color: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-400',
  },
  [AssignmentStatus.COMPLETED]: {
    label: '完了',
    color: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-400',
  },
} as const

export const REMINDER_THRESHOLDS = {
  URGENT: 1,
  WARNING: 3,
  INFO: 7,
} as const

export const CATEGORY_CONFIG = {
  [CourseCategory.GENERAL]: { label: '一般教養科目' },
  [CourseCategory.LANGUAGE]: { label: '語学科目' },
  [CourseCategory.SPECIALIZED]: { label: '専門科目' },
  [CourseCategory.SEMINAR]: { label: '演習・ゼミ' },
  [CourseCategory.LAB]: { label: '実験・実習' },
  [CourseCategory.SPORTS]: { label: '体育・スポーツ' },
  [CourseCategory.CERTIFICATION]: { label: '資格系授業' },
  [CourseCategory.CAREER]: { label: '就活・キャリア系' },
  [CourseCategory.ONLINE_PBL]: { label: 'オンライン・PBL型授業' },
} as const

export const GENERAL_SUBJECT_GROUPS = [
  {
    group: '人文系',
    subjects: ['哲学', '倫理学', '心理学', '歴史学', '日本史', '世界史', '文学', '言語学', '宗教学', '美術史'],
  },
  {
    group: '社会科学系',
    subjects: ['経済学', '法学', '政治学', '社会学', '国際関係論', '経営学', '会計学', 'マーケティング', '教育学'],
  },
  {
    group: '自然科学系',
    subjects: ['数学', '統計学', '物理学', '化学', '生物学', '地学', '環境科学'],
  },
  {
    group: '情報・データ系',
    subjects: ['情報リテラシー', 'プログラミング', 'AI基礎', 'データサイエンス', '情報倫理'],
  },
  {
    group: '言語系',
    subjects: ['英語', '第二外国語', '中国語', '韓国語', 'フランス語', 'ドイツ語', 'スペイン語', 'ロシア語'],
  },
  {
    group: '健康・体育系',
    subjects: ['スポーツ実技', '健康科学', '栄養学'],
  },
] as const

export const LANGUAGE_SUBJECT_GROUPS = [
  {
    group: '英語系',
    subjects: [
      '英語', '英会話', 'Academic English', 'English Communication',
      '英語リーディング', '英語ライティング', '英語リスニング',
      '英語プレゼンテーション', '英語ディベート',
      'TOEIC対策', 'TOEFL対策', 'IELTS対策',
      'ビジネス英語', '医学英語', '科学技術英語', '法律英語',
      '英語文法', '英語音声学', '英語学', '英米文化', '英文学',
    ],
  },
  {
    group: 'ヨーロッパ系言語',
    subjects: [
      'フランス語', '初級フランス語', 'フランス会話', 'フランス文学', 'フランス文化',
      'ドイツ語', '初級ドイツ語', 'ドイツ会話', 'ドイツ文学',
      'スペイン語', '初級スペイン語', 'スペイン会話', 'ラテンアメリカ文化',
      'イタリア語', 'イタリア語会話', 'イタリア文化',
      'ロシア語', 'ロシア語文法', 'ロシア文学',
      'ポルトガル語', 'ブラジル文化', 'ポルトガル語会話',
      'オランダ語', 'ギリシャ語', '古代ギリシャ語', '現代ギリシャ語', 'ラテン語',
    ],
  },
  {
    group: 'アジア系言語',
    subjects: [
      '中国語', '中国語会話', '中国語読解', '中国文化',
      '韓国語（朝鮮語）', '韓国語会話', '韓国文化',
      'アラビア語', 'アラビア語文法', '中東文化',
      'ヒンディー語', 'タイ語', 'ベトナム語', 'インドネシア語', 'マレー語',
      'モンゴル語', 'トルコ語', 'ペルシャ語', 'ウルドゥー語', 'タミル語',
      'ビルマ語（ミャンマー語）', 'ネパール語', 'カンボジア語（クメール語）', 'ラオス語',
    ],
  },
  {
    group: 'アフリカ系言語',
    subjects: ['スワヒリ語', 'アムハラ語', 'ズールー語', 'ハウサ語'],
  },
  {
    group: '北欧・東欧系言語',
    subjects: [
      'スウェーデン語', 'デンマーク語', 'ノルウェー語', 'フィンランド語', 'アイスランド語',
      'ポーランド語', 'チェコ語', 'ハンガリー語', 'ルーマニア語',
      'ブルガリア語', 'セルビア語', 'ウクライナ語',
    ],
  },
  {
    group: '古典語・特殊言語',
    subjects: [
      '古典日本語', '漢文', 'サンスクリット語',
      '古典ラテン語', '古代ギリシャ語', '聖書ヘブライ語',
    ],
  },
  {
    group: '日本語教育系',
    subjects: ['日本語', '日本語会話', '日本語作文', 'ビジネス日本語', '日本語教育学'],
  },
  {
    group: '言語学系科目',
    subjects: [
      '言語学', '応用言語学', '社会言語学', '音声学', '音韻論',
      '統語論', '意味論', '第二言語習得論', '翻訳論', '通訳論',
    ],
  },
  {
    group: '実践・専門語学',
    subjects: [
      '通訳演習', '翻訳演習', '観光英語', '航空英語',
      '医療通訳', '外交英語', 'ビジネス中国語', '法律英語',
    ],
  },
  {
    group: 'AI翻訳・多文化系',
    subjects: [
      'AI翻訳活用', '多文化コミュニケーション', '異文化理解',
      'グローバルコミュニケーション', 'オンライン英会話演習',
    ],
  },
] as const

export type SubjectGroup = { readonly group: string; readonly subjects: readonly string[] }

export const CATEGORY_SUBJECT_GROUPS: Record<string, readonly SubjectGroup[]> = {
  [CourseCategory.GENERAL]: GENERAL_SUBJECT_GROUPS,
  [CourseCategory.LANGUAGE]: LANGUAGE_SUBJECT_GROUPS,
}

export const CATEGORY_SUBJECTS: Record<string, readonly string[]> = {
  [CourseCategory.GENERAL]: GENERAL_SUBJECT_GROUPS.flatMap((g) => g.subjects),
  [CourseCategory.LANGUAGE]: LANGUAGE_SUBJECT_GROUPS.flatMap((g) => g.subjects),
} as const

export const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

export const PERIOD_LABELS = ['1限', '2限', '3限', '4限', '5限', '6限', '7限'] as const

export const COURSE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
] as const
