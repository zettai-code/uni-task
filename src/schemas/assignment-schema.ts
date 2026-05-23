import { z } from 'zod'

export const createAssignmentSchema = z.object({
  courseId: z.string().min(1, '授業を選択してください'),
  title: z.string().max(200, '200文字以内で入力してください').default(''),
  description: z.string().max(2000, '2000文字以内で入力してください').default(''),
  dueDate: z.string().default(''),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
