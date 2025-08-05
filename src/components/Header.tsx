'use client'

import { useState } from 'react'

interface User {
  user_id: number
  email: string
  created_at: string
  last_login?: string
}

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('ログアウトエラー:', err)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg relative">
      {/* 中央上部の装飾的なライン */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FFBB3F]/60 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="relative group cursor-pointer" onClick={() => window.location.href = '/canvas-list'}>
              <div className="relative z-10">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#FFBB3F] via-orange-500 to-[#FF8C00] bg-clip-text text-transparent group-hover:from-[#FF8C00] group-hover:via-orange-500 group-hover:to-[#FFBB3F] transition-all duration-300">
                  ConceptCraft
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFBB3F] to-orange-500 group-hover:w-full transition-all duration-500"></div>
                <p className="text-xs text-gray-600 font-medium">by tantan</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium text-sm relative group">
              こんにちは、{user?.email}さん
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFBB3F] group-hover:w-full transition-all duration-500"></div>
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 