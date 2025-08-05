'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

export default function CreateAICanvasPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [idea, setIdea] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async () => {
    if (!idea.trim()) {
      alert('アイデアを入力してください')
      return
    }

    setIsSubmitting(true)
    
    // 本来はここでバックエンドAPIを呼び出す
    // 現在はデザイン確認用のダミー処理
    setTimeout(() => {
      alert('生成されました！次のページで必要に応じて微修正を行ってください')
      setIsSubmitting(false)
      // manualページに移動
      window.location.href = '/canvas/create/manual'
    }, 1000)
  }

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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">リーンキャンバスの自動生成</h1>
            <p className="text-gray-600 text-lg font-medium">AIがあなたのアイデアを基にリーンキャンバスを自動生成します</p>
          </div>

          {/* メインコンテンツ */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
              {/* アイデア入力セクション */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  あなたのアイデアをできるだけ詳しく入力してください
                </label>
                <div className="relative">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="例：新しいSNSアプリを作りたい。既存のSNSは複雑すぎて、シンプルで直感的なコミュニケーションに特化したプラットフォームが欲しい。写真や動画よりも、テキストベースの会話を重視し、ユーザーが気軽に投稿できる環境を提供したい。..."
                    className="w-full h-64 p-6 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                    style={{ fontSize: '16px', lineHeight: '1.6' }}
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-[#FFBB3F] font-medium">
                    {idea.length} 文字
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 font-medium">
                  ※ より詳細な情報を入力していただくことで、より精度の高いキャンバスが生成されます
                </p>
              </div>

              {/* 進むボタン */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !idea.trim()}
                  className={`px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform ${
                    isSubmitting || !idea.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white hover:scale-110 hover:shadow-lg shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>生成中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>進む</span>
                    </div>
                  )}
                </button>
              </div>

              {/* ヒントセクション */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  入力のヒント
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 解決したい問題や課題について詳しく説明してください</li>
                  <li>• ターゲットユーザーは誰かを具体的に記載してください</li>
                  <li>• 既存の解決策との違いや独自性を説明してください</li>
                  <li>• どのような価値を提供したいかを明確にしてください</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 