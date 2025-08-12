'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

interface Project {
  project_id: number
  project_name: string
  created_at: string
}

export default function CanvasListPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'project_name' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const initializePage = async () => {
      try {
        // 認証チェックを試行
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (authResponse.ok) {
          const userData = await authResponse.json()
          setUser(userData)
          
          // プロジェクト取得を試行
          try {
            console.log('Fetching projects from /api/projects...')
            const projectsResponse = await fetch('/api/projects', {
              credentials: 'include',
            })
            
            if (projectsResponse.ok) {
              const data = await projectsResponse.json()
              console.log('Projects fetched successfully:', data)
              setProjects(data)
            } else {
              console.error('Failed to fetch projects:', projectsResponse.status, projectsResponse.statusText)
              setProjects([])
            }
          } catch (err) {
            console.error('Error fetching projects:', err)
            setProjects([])
          }
        } else {
          console.error('Authentication failed:', authResponse.status)
          window.location.href = '/login'
        }
      } catch (err) {
        console.error('Error in initializePage:', err)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [])
  
  const handleDelete = async (projectId: number) => {
    if (!confirm('このプロジェクトを削除しますか？')) return
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (response.ok) {
        setProjects(projects.filter(project => project.project_id !== projectId))
        console.log('Project deleted successfully')
      } else {
        console.error('Failed to delete project:', response.status)
        alert('プロジェクトの削除に失敗しました')
      }
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('プロジェクトの削除に失敗しました')
    }
  }

  const handleCreate = () => {
    setShowCreateModal(true)
  }

  const handleCreateWithAI = () => {
    setShowCreateModal(false)
    window.location.href = '/canvas/create/ai'
  }

  const handleCreateManually = () => {
    setShowCreateModal(false)
    window.location.href = '/canvas/create/manual'
  }

  // 検索と並び替えの処理
  const filteredAndSortedProjects = projects
    .filter(project => 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number = a[sortBy]
      let bValue: string | number = b[sortBy]
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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
          {/* ヘッダー部分 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">リーンキャンバス一覧</h1>
              <p className="text-gray-600">作成したリーンキャンバスを管理できます</p>
            </div>
            <button
              onClick={handleCreate}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>作成する</span>
            </button>
          </div>

          {/* 検索と並び替え */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 検索 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="プロジェクト名で検索..."
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
                    onChange={(e) => setSortBy(e.target.value as 'project_name' | 'created_at')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors h-10"
                  >
                    <option value="created_at">作成日</option>
                    <option value="project_name">プロジェクト名</option>
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

          {/* プロジェクト一覧 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プロジェクト名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? '検索結果が見つかりませんでした' : 'プロジェクトがまだありません'}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedProjects.map((project) => (
                      <tr 
                        key={project.project_id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/canvas/${project.project_id}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.project_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(project.created_at).toLocaleDateString('ja-JP')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(project.project_id)
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
      </main>

      {/* 作成方法選択モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">作成方法を選択</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleCreateWithAI}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-lg font-semibold">アイデアからAIで自動生成</span>
              </button>
              
              <button
                onClick={handleCreateManually}
                className="w-full bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-lg font-semibold">自分で作成</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full mt-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 