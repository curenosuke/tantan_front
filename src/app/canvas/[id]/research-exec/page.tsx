'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface ResearchHistory {
  research_id: number
  researched_at: string
  user_email: string
}

export default function ResearchExecPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [researchHistory, setResearchHistory] = useState<ResearchHistory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'researched_at' | 'user_email'>('researched_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // ダミーデータ（新型）
  const dummyResearchHistory: ResearchHistory[] = [
    {
      research_id: 1,
      researched_at: "2024-01-15T14:30:15Z",
      user_email: "user1@example.com"
    },
    {
      research_id: 2,
      researched_at: "2024-01-14T09:15:42Z",
      user_email: "user2@example.com"
    }
  ]

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          // 本番APIからリサーチ履歴取得
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/research-list`, {
              credentials: 'include',
            })
            if (res.ok) {
              const data = await res.json()
              setResearchHistory(data)
            } else {
              setResearchHistory(dummyResearchHistory)
            }
          } catch {
            setResearchHistory(dummyResearchHistory)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        setResearchHistory(dummyResearchHistory)
      } finally {
        setLoading(false)
      }
    }
    checkAuthAndFetch()
  }, [projectId])

  const handleDelete = async (researchId: number) => {
    if (confirm('このリサーチ履歴を削除しますか？')) {
      try {
        setResearchHistory(researchHistory.filter(research => research.research_id !== researchId))
        alert('リサーチ履歴を削除しました（デザイン確認用）')
      } catch (err) {
        console.error('リサーチ履歴削除エラー:', err)
      }
    }
  }

  const handleNewResearch = () => {
    router.push(`/canvas/${projectId}/research-exec/confirm`)
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
      <div className="flex min-h-screen">
        {/* サイドバー */}
        <Sidebar projectId={projectId} />
        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">リサーチ実施</h1>
                <p className="text-gray-600">AIを使ってリーンキャンバスをアップデートします</p>
              </div>
              {/* 新規リサーチボタン */}
              <button
                onClick={handleNewResearch}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>新規リサーチ</span>
              </button>
            </div>
            {/* リサーチ履歴一覧 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        リサーチ実施時刻
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        実施者
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {researchHistory.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                          {'リサーチ履歴がまだありません'}
                        </td>
                      </tr>
                    ) : (
                      researchHistory.map((research) => (
                        <tr
                          key={research.research_id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/canvas/${projectId}/research-exec/ref?rid=${research.research_id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(research.researched_at).toLocaleDateString('ja-JP')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(research.researched_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{research.user_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(research.research_id) }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="削除"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}