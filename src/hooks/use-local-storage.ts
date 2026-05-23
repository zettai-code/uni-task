'use client'

import { useState, useEffect, useCallback } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = readStorage<T>(key)
    if (stored !== null) {
      setValue(stored)
    }
    setIsLoaded(true)
  }, [key])

  const updateValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === 'function'
          ? (updater as (prev: T) => T)(prev)
          : updater
        writeStorage(key, next)
        return next
      })
    },
    [key]
  )

  return [value, updateValue, isLoaded] as const
}
