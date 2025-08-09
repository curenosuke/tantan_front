'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  projectId: string
}

export default function Sidebar({ projectId }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      id: 'view',
      label: 'キャンバスを見る',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      href: `/canvas/${projectId}`,
      isHome: true
    },
    {
      id: 'edit',
      label: '直接修正',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      href: `/canvas/${projectId}/edit`
    },
    {
      id: 'logic-check',
      label: '論理チェック',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: `/canvas/${projectId}/logic-check`
    },
    {
      id: 'research-prep',
      label: 'リサーチ準備',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: `/canvas/${projectId}/research-prep`
    },
    {
      id: 'research-exec',
      label: 'リサーチ実施',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      href: `/canvas/${projectId}/research-exec`
    },
    {
      id: 'interview-prep',
      label: 'インタビュー準備',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      href: `/canvas/${projectId}/interview-prep`
    },
    {
      id: 'interview-wrap',
      label: 'インタビューラップアップ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: `/canvas/${projectId}/interview-wrap`
    },
    {
      id: 'history',
      label: 'ブラッシュアップヒストリー',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: `/canvas/${projectId}/history`
    },
    {
      id: 'guide',
      label: '初めての人ガイド',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: `/canvas/${projectId}/guide`
    }
  ]

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-20' : 'w-72'}`}>
      {/* 折りたたみボタン */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="ml-2 text-sm text-gray-600"></span>}
        </button>
      </div>

      {/* メニューアイテム */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={item.id}>
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.href || (item.href !== `/canvas/${projectId}` && pathname.startsWith(item.href))
                  ? item.isHome
                    ? 'bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white shadow-md'
                    : 'bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <div className={`transition-all duration-300 ml-3 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                <span className={`font-medium whitespace-nowrap ${item.isHome ? 'text-sm' : 'text-sm'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
            
            {/* 区切り線 */}
            {index === 7 && !isCollapsed && (
              <div className="my-4 border-t border-gray-200"></div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
} 