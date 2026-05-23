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

export const CATEGORY_SUBJECTS: Record<string, readonly string[]> = {
  [CourseCategory.GENERAL]: GENERAL_SUBJECT_GROUPS.flatMap((g) => g.subjects),
} as const

export const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

export const PERIOD_LABELS = ['1限', '2限', '3限', '4限', '5限', '6限', '7限'] as const

export const COURSE_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
] as const
