import type { UserId } from './common'

export type TodoId = string & { readonly __brand: 'TodoId' }

export interface Todo {
  readonly id: TodoId
  readonly userId: UserId
  readonly text: string
  readonly completed: boolean
  readonly createdAt: string
}
