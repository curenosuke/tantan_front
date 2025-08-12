'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

export default function DashboardPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ログイン状態をチェック
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // 未認証の場合はログイン画面にリダイレクト
          window.location.href = '/login'
        }
      } catch (err) {
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-700 font-medium">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-dashed border-slate-300 rounded-lg h-96 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                ダッシュボード
              </h2>
              <p className="text-slate-700 mb-8 font-medium">
                ログインが完了しました！<br />
                今後こちらにリーンキャンバス機能が追加される予定です。
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 shadow-lg">
                <h3 className="text-lg font-medium text-purple-900 mb-2">
                  開発予定機能
                </h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>生成AIとの壁打ち機能</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>リーンキャンバスの作成・編集</span>
                  </li>
                  <li className="flex items-center justify-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>インタラクティブな事業企画支援</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}