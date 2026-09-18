import type { ReactNode } from 'react'
import { YenylethsSidebar } from './ui/yenyleths-sidebar'

interface LayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  username: string
}

export default function Layout({ children, activeTab, onTabChange, onLogout, username }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <YenylethsSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
        username={username}
      />
      <div className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}
