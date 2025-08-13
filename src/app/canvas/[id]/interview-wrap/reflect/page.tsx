'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface InterviewMemo {
  memo_id: number
  interview_name: string
  interview_date: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export default function InterviewReflectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [memos, setMemos] = useState<InterviewMemo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'interview_name' | 'interview_date' | 'uploaded_by' | 'created_at' | 'updated_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // ダミーデータ
  const dummyMemos: InterviewMemo[] = [
    {
      memo_id: 1,
      interview_name: "農家Aさんインタビュー",
      interview_date: "2024-01-15T14:30:00",
      uploaded_by: "のーち",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T16:45:00Z"
    },
    {
      memo_id: 2,
      interview_name: "農家Bさんインタビュー",
      interview_date: "2024-01-14T09:15:00",
      uploaded_by: "かっさあ",
      created_at: "2024-01-14T16:45:00Z",
      updated_at: "2024-01-14T18:20:00Z"
    },
    {
      memo_id: 3,
      interview_name: "農家Cさんインタビュー",
      interview_date: "2024-01-13T13:45:00",
      uploaded_by: "ふじさん",
      created_at: "2024-01-13T11:15:00Z",
      updated_at: "2024-01-13T15:30:00Z"
    },
    {
      memo_id: 4,
      interview_name: "農家Dさんインタビュー",
      interview_date: "2024-01-12T10:00:00",
      uploaded_by: "のな",
      created_at: "2024-01-12T09:20:00Z",
      updated_at: "2024-01-12T11:45:00Z"
    },
    {
      memo_id: 5,
      interview_name: "農家Eさんインタビュー",
      interview_date: "2024-01-11T15:30:00",
      uploaded_by: "のな",
      created_at: "2024-01-11T14:30:00Z",
      updated_at: "2024-01-11T17:15:00Z"
    }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          // バックエンド未接続時はダミーデータを使用
          setMemos(dummyMemos)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setMemos(dummyMemos)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleDelete = async (memoId: number) => {
    if (confirm('このインタビューメモを削除してもよろしいですか？')) {
      // 本来はここでバックエンドAPIを呼び出す
      // 現在はデザイン確認用のダミー処理
      setMemos(memos.filter(memo => memo.memo_id !== memoId))
    }
  }

  const handleAddMemo = () => {
    router.push(`/canvas/${projectId}/interview-wrap/memo-edit`)
  }

  const handleEditMemo = (memoId: number) => {
    router.push(`/canvas/${projectId}/interview-wrap/memo-edit?id=${memoId}`)
  }

  const handleReflectToCanvas = (memoId: number) => {
    // キャンバスに反映する処理
    alert(`インタビューメモID: ${memoId} をキャンバスに反映しました（デザイン確認用）`)
  }

  // 検索とソートの処理
  const filteredAndSortedMemos = memos
    .filter(memo => 
      memo.interview_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number
      
      switch (sortBy) {
        case 'interview_name':
          aValue = a.interview_name
          bValue = b.interview_name
          break
        case 'interview_date':
          aValue = a.interview_date
          bValue = b.interview_date
          break
        case 'uploaded_by':
          aValue = a.uploaded_by
          bValue = b.uploaded_by
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime()
          bValue = new Date(b.updated_at).getTime()
          break
        default:
          aValue = a.created_at
          bValue = b.created_at
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatInterviewDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">インタビューメモ反映</h1>
                <p className="text-gray-600">保存されたインタビューメモをキャンバスに反映できます</p>
              </div>
              
              {/* メモ追加ボタン */}
              <button
                onClick={handleAddMemo}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>インタビューメモ追加</span>
              </button>
            </div>

            {/* 検索とソート */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 検索 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="インタビュー名や追加者で検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* 並び替え */}
                <div className="flex gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'interview_name' | 'interview_date' | 'uploaded_by' | 'created_at' | 'updated_at')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors h-10"
                    >
                      <option value="created_at">作成日</option>
                      <option value="updated_at">最終更新日</option>
                      <option value="interview_name">インタビュー名</option>
                      <option value="interview_date">インタビュー実施日</option>
                      <option value="uploaded_by">追加者</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">順序</label>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors h-10"
                    >
                      {sortOrder === 'asc' ? '昇順' : '降順'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* メモ一覧 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        インタビュー名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        インタビュー実施日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アップロード者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最終更新日
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedMemos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          {searchTerm ? '検索結果が見つかりませんでした' : 'インタビューメモがまだありません'}
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedMemos.map((memo) => (
                        <tr key={memo.memo_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{memo.interview_name}</div>
                                <div className="text-xs text-gray-500">作成: {formatDate(memo.created_at)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatInterviewDate(memo.interview_date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{memo.uploaded_by}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(memo.updated_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditMemo(memo.memo_id)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="編集"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReflectToCanvas(memo.memo_id)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="キャンバスに反映"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(memo.memo_id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="削除"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
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