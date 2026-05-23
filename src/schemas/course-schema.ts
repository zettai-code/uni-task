import { z } from 'zod'

export const createCourseSchema = z.object({
  name: z.string().min(1, '授業名は必須です').max(100, '100文字以内で入力してください'),
  instructor: z.string().max(50, '50文字以内で入力してください').default(''),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '有効な色コードを選択してください'),
  dayOfWeek: z.number().int().min(0).max(6),
  period: z.number().int().min(1).max(7),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
