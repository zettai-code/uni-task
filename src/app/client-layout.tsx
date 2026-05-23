'use client'

import { type ReactNode } from 'react'
import { AppShell } from './app-shell'

export function ClientLayout({ children }: { readonly children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
