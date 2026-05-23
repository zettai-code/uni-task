'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface NavBarProps {
  readonly username: string
  readonly onLogout: () => void
}

const navItems = [
  { href: '/', label: 'ダッシュボード', icon: '📋' },
  { href: '/calendar', label: 'カレンダー', icon: '📅' },
  { href: '/courses', label: '授業管理', icon: '📚' },
] as const

export function NavBar({ username, onLogout }: NavBarProps) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              UniTask
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{username}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
