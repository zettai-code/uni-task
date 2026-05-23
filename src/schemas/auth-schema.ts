import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です').max(50, '50文字以内で入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください').max(100),
})

export const registerSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です').max(50, '50文字以内で入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください').max(100),
  confirmPassword: z.string().min(1, '確認用パスワードは必須です'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
