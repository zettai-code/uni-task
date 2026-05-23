'use client'

import { useState } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-bold text-blue-600 shrink-0">
            UniTask
          </Link>
          <div className="hidden sm:flex items-center gap-1">
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
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-600 truncate max-w-[100px]">{username}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              ログアウト
            </Button>
          </div>
          <button
            className="sm:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">{username}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
