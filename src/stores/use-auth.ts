'use client'

import { useState, useEffect, useCallback } from 'react'
import { readStorage, writeStorage, removeStorage } from '@/lib/storage'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { generateUserId } from '@/lib/id'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User, AuthSession } from '@/types/user'
import type { UserId } from '@/types/common'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = readStorage<AuthSession>(STORAGE_KEYS.SESSION)
    setSession(stored)
    setIsLoaded(true)
  }, [])

  const getUsers = useCallback((): readonly User[] => {
    return readStorage<readonly User[]>(STORAGE_KEYS.USERS) ?? []
  }, [])

  const register = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getUsers()
      const exists = users.some((u) => u.username === username)
      if (exists) {
        return { success: false, error: 'このユーザー名は既に使用されています' }
      }

      const passwordHash = await hashPassword(password)
      const newUser: User = {
        id: generateUserId(),
        username,
        passwordHash,
        createdAt: new Date().toISOString(),
      }

      writeStorage(STORAGE_KEYS.USERS, [...users, newUser])

      const newSession: AuthSession = { userId: newUser.id, username: newUser.username }
      writeStorage(STORAGE_KEYS.SESSION, newSession)
      setSession(newSession)

      return { success: true }
    },
    [getUsers]
  )

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getUsers()
      const user = users.find((u) => u.username === username)
      if (!user) {
        return { success: false, error: 'ユーザー名またはパスワードが正しくありません' }
      }

      const isValid = await verifyPassword(password, user.passwordHash)
      if (!isValid) {
        return { success: false, error: 'ユーザー名またはパスワードが正しくありません' }
      }

      const newSession: AuthSession = { userId: user.id, username: user.username }
      writeStorage(STORAGE_KEYS.SESSION, newSession)
      setSession(newSession)

      return { success: true }
    },
    [getUsers]
  )

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEYS.SESSION)
    setSession(null)
  }, [])

  return {
    session,
    isLoaded,
    isLoggedIn: session !== null,
    userId: session?.userId as UserId | undefined,
    username: session?.username,
    register,
    login,
    logout,
  }
}
