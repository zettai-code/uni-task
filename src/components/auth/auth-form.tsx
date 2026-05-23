'use client'

import { useState, type FormEvent } from 'react'
import { loginSchema, registerSchema } from '@/schemas/auth-schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Mode = 'login' | 'register'

interface AuthFormProps {
  readonly onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  readonly onRegister: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export function AuthForm({ onLogin, onRegister }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (mode === 'login') {
      const result = loginSchema.safeParse({ username, password })
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]
          if (typeof field === 'string') {
            fieldErrors[field] = issue.message
          }
        }
        setErrors(fieldErrors)
        return
      }

      setIsSubmitting(true)
      const loginResult = await onLogin(username, password)
      setIsSubmitting(false)
      if (!loginResult.success) {
        setErrors({ form: loginResult.error ?? 'ログインに失敗しました' })
      }
    } else {
      const result = registerSchema.safeParse({ username, password, confirmPassword })
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]
          if (typeof field === 'string') {
            fieldErrors[field] = issue.message
          }
        }
        setErrors(fieldErrors)
        return
      }

      setIsSubmitting(true)
      const registerResult = await onRegister(username, password)
      setIsSubmitting(false)
      if (!registerResult.success) {
        setErrors({ form: registerResult.error ?? '登録に失敗しました' })
      }
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setErrors({})
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">UniTask</h1>
          <p className="mt-2 text-gray-500">大学生のための課題管理アプリ</p>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            {mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </h2>
          {errors.form && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errors.form}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'register' && (
              <Input
                label="パスワード（確認）"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            )}
            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting
                ? '処理中...'
                : mode === 'login'
                  ? 'ログイン'
                  : 'アカウント作成'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {mode === 'login'
                ? 'アカウントを作成する'
                : '既にアカウントをお持ちの方'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
