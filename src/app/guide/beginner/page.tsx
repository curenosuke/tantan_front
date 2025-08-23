'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function BeginnerGuidePage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/me`, {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時はそのままページを表示（開発時用）
        console.log('認証チェックでエラーが発生しました')
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
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ページヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">初めての人ガイド</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            リーンキャンバス作成ツールの使い方をゼロから学びましょう
          </p>
        </div>

        {/* ステップガイド */}
        <div className="space-y-8">
          
          {/* ステップ1 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">アカウント登録・ログイン</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  まずはアカウントを作成してログインしましょう。メールアドレスとパスワードを入力するだけで簡単に始められます。
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    メールアドレスとパスワードで登録
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    登録完了後、すぐに利用開始
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">ログイン画面</h4>
                  <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded text-white flex items-center justify-center text-sm font-medium">
                      ログイン
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ステップ2 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">キャンバス一覧でプロジェクトを管理</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  ログイン後、キャンバス一覧ページで自分のプロジェクトを管理できます。新しいキャンバスを作成したり、既存のキャンバスを編集したりできます。
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    複数のプロジェクトを管理
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AIサポートまたは手動で作成
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    検索・ソート機能で簡単管理
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">キャンバス一覧</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded text-white flex items-center justify-center text-sm font-medium">
                    新しいキャンバスを作成
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ステップ3 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">リーンキャンバスを作成・編集</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  AIサポートまたは手動でリーンキャンバスを作成できます。9つの要素を順番に入力していくことで、あなたのビジネスアイデアを整理できます。
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">リーンキャンバスの9つの要素</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm text-blue-700">
                    <span>• 課題　• ソリューション　• 独自の価値提案</span>
                    <span>• 圧倒的な優位性　• 顧客セグメント</span>
                    <span>• 既存の代替品　• 主要指標　• 販路</span>
                    <span>• 費用構造　• 収益の流れ</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">キャンバス編集画面</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">課題</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">ソリューション</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">独自の価値提案</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">圧倒的な優位性</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">顧客セグメント</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200">代替品</div>
                  <div className="bg-orange-100 rounded p-2 text-xs text-center border border-orange-200 col-span-3">主要指標・販路・費用構造・収益の流れ</div>
                </div>
              </div>
            </div>
          </div>

          {/* ステップ4 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                4
              </div>
              <h2 className="text-2xl font-bold text-gray-900">検証とブラッシュアップ</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  作成したキャンバスを様々な機能で検証・改善していきます。論理チェック、リサーチ、インタビューなどを通じてアイデアを磨き上げましょう。
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    論理チェックで整合性を確認
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    リサーチで市場調査
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    インタビューで顧客の声を収集
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    バージョン管理でヒストリーを追跡
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">検証ツール</h4>
                <div className="space-y-3">
                  <div className="bg-blue-100 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-blue-800 font-medium">論理チェック</span>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm text-green-800 font-medium">リサーチ</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm text-purple-800 font-medium">インタビュー</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 始めるボタン */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/canvas-list')}
            className="px-12 py-4 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
          >
            今すぐ始める
          </button>
          <p className="text-gray-600 mt-4">
            準備はできました！早速リーンキャンバスを作成してみましょう
          </p>
        </div>

      </main>
    </div>
  )
}