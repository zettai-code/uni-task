'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@/stores/use-auth'
import { useCourses } from '@/stores/use-courses'
import { useAssignments } from '@/stores/use-assignments'
import { useNotification } from '@/hooks/use-notification'
import { AuthForm } from '@/components/auth/auth-form'
import { NavBar } from '@/components/layout/nav-bar'

interface AppShellProps {
  readonly children: ReactNode
}

function NotificationProvider() {
  const { userId } = useAuth()
  const { courses } = useCourses(userId)
  const { assignments } = useAssignments(userId)
  useNotification(assignments, courses)
  return null
}

export function AppShell({ children }: AppShellProps) {
  const { isLoggedIn, isLoaded, username, login, register, logout } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <AuthForm onLogin={login} onRegister={register} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar username={username ?? ''} onLogout={logout} />
      <NotificationProvider />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
