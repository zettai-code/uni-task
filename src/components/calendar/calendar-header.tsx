'use client'

import { Button } from '@/components/ui/button'
import { getMonthLabel } from '@/lib/date-utils'

interface CalendarHeaderProps {
  readonly year: number
  readonly month: number
  readonly onPrevMonth: () => void
  readonly onNextMonth: () => void
  readonly onToday: () => void
}

export function CalendarHeader({ year, month, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">{getMonthLabel(year, month)}</h2>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onToday}>
          今日
        </Button>
        <Button variant="secondary" size="sm" onClick={onPrevMonth}>
          ◀
        </Button>
        <Button variant="secondary" size="sm" onClick={onNextMonth}>
          ▶
        </Button>
      </div>
    </div>
  )
}
