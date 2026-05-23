import type { UserId } from './common'

export interface User {
  readonly id: UserId
  readonly username: string
  readonly passwordHash: string
  readonly createdAt: string
}

export interface AuthSession {
  readonly userId: UserId
  readonly username: string
}
