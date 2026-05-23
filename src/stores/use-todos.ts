'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { Todo, TodoId } from '@/types/todo'
import type { UserId } from '@/types/common'

const STORAGE_KEY = 'uni-task-todos'

function generateTodoId(): TodoId {
  return crypto.randomUUID() as TodoId
}

export function useTodos(userId: UserId | undefined) {
  const [allTodos, setAllTodos, isLoaded] = useLocalStorage<readonly Todo[]>(STORAGE_KEY, [])

  const todos = useMemo(
    () => (userId ? allTodos.filter((t) => t.userId === userId) : []),
    [allTodos, userId]
  )

  const addTodo = useCallback(
    (text: string) => {
      if (!userId) return
      const newTodo: Todo = {
        id: generateTodoId(),
        userId,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      setAllTodos((prev) => [...prev, newTodo])
    },
    [userId, setAllTodos]
  )

  const toggleTodo = useCallback(
    (id: TodoId) => {
      setAllTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    },
    [setAllTodos]
  )

  const updateTodo = useCallback(
    (id: TodoId, text: string) => {
      setAllTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text } : t))
      )
    },
    [setAllTodos]
  )

  const deleteTodo = useCallback(
    (id: TodoId) => {
      setAllTodos((prev) => prev.filter((t) => t.id !== id))
    },
    [setAllTodos]
  )

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  return { todos, isLoaded, addTodo, toggleTodo, updateTodo, deleteTodo, completedCount }
}
