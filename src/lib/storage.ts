export function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const item = window.localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Failed to read from localStorage [${key}]:`, error)
    return null
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to write to localStorage [${key}]:`, error)
    throw new Error('データの保存に失敗しました。ストレージの容量を確認してください。')
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove from localStorage [${key}]:`, error)
  }
}
