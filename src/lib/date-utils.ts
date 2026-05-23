export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const diffMs = dueStart.getTime() - todayStart.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function getUrgencyLevel(daysUntil: number): 'urgent' | 'warning' | 'info' | 'normal' {
  if (daysUntil < 0) return 'urgent'
  if (daysUntil <= 1) return 'urgent'
  if (daysUntil <= 3) return 'warning'
  if (daysUntil <= 7) return 'info'
  return 'normal'
}

export function getMonthLabel(year: number, month: number): string {
  return `${year}年${month + 1}月`
}
