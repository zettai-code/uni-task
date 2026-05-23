import { z } from 'zod'

export const createAssignmentSchema = z.object({
  courseId: z.string().min(1, '授業を選択してください'),
  title: z.string().min(1, '課題名は必須です').max(200, '200文字以内で入力してください'),
  description: z.string().max(2000, '2000文字以内で入力してください').default(''),
  dueDate: z.string().min(1, '締切日を入力してください'),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
