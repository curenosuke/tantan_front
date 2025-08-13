'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface ResearchFile {
  file_id: number
  file_name: string
  file_type: '自社情報' | '市場情報' | '競合情報' | 'マクロトレンド'
  uploaded_by: string
  uploaded_at: string
  file_size: string
}

export default function ResearchPrepPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<ResearchFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | '自社情報' | '市場情報' | '競合情報' | 'マクロトレンド'>('all')
  const [sortBy, setSortBy] = useState<'file_name' | 'file_type' | 'uploaded_by' | 'uploaded_at'>('uploaded_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedFileType, setSelectedFileType] = useState<'自社情報' | '市場情報' | '競合情報' | 'マクロトレンド'>('自社情報')
  const [isDragOver, setIsDragOver] = useState(false)

  // ダミーデータ
  const dummyFiles: ResearchFile[] = [
    {
      file_id: 1,
      file_name: "自社技術資料_2024.pdf",
      file_type: "自社情報",
      uploaded_by: "のーち",
      uploaded_at: "2024-01-15T10:30:00Z",
      file_size: "2.3MB"
    },
    {
      file_id: 2,
      file_name: "市場調査レポート_Q4.pdf",
      file_type: "市場情報",
      uploaded_by: "かっさあ",
      uploaded_at: "2024-01-14T16:45:00Z",
      file_size: "1.8MB"
    },
    {
      file_id: 3,
      file_name: "競合他社分析.xlsx",
      file_type: "競合情報",
      uploaded_by: "ふじさん",
      uploaded_at: "2024-01-13T11:15:00Z",
      file_size: "3.1MB"
    },
    {
      file_id: 4,
      file_name: "マクロトレンド_2024.docx",
      file_type: "マクロトレンド",
      uploaded_by: "のな",
      uploaded_at: "2024-01-12T09:20:00Z",
      file_size: "1.2MB"
    },
    {
      file_id: 5,
      file_name: "技術仕様書_v2.pdf",
      file_type: "自社情報",
      uploaded_by: "のな",
      uploaded_at: "2024-01-11T14:30:00Z",
      file_size: "4.5MB"
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
          setFiles(dummyFiles)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setFiles(dummyFiles)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleDelete = async (fileId: number) => {
    if (confirm('このファイルを削除しますか？')) {
      try {
        // バックエンド未接続時のデザイン確認用
        setFiles(files.filter(file => file.file_id !== fileId))
        alert('ファイルを削除しました（デザイン確認用）')
      } catch (err) {
        console.error('ファイル削除エラー:', err)
      }
    }
  }

  const handleUpload = () => {
    setShowUploadModal(true)
  }

  const handleFileUpload = () => {
    if (uploadedFiles.length === 0) {
      alert('ファイルを選択してください')
      return
    }

    // バックエンド未接続時のデザイン確認用
    const newFiles: ResearchFile[] = uploadedFiles.map((file, index) => ({
      file_id: Date.now() + index,
      file_name: file.name,
      file_type: selectedFileType,
      uploaded_by: user?.email || 'Unknown',
      uploaded_at: new Date().toISOString(),
      file_size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
    }))

    setFiles([...newFiles, ...files])
    setUploadedFiles([])
    setShowUploadModal(false)
    alert('ファイルをアップロードしました（デザイン確認用）')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setUploadedFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setUploadedFiles(selectedFiles)
    }
  }

  // フィルタリングとソート
  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || file.file_type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy]
      let bValue: string | number = b[sortBy]
      
      if (sortBy === 'uploaded_at') {
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
      
      <div className="flex min-h-screen">
        {/* サイドバー */}
        <Sidebar projectId={projectId} />
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">リサーチ準備</h1>
                <p className="text-gray-600">リサーチに使用するファイルを管理できます</p>
              </div>
              
              {/* アップロードボタン */}
              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>ファイルを追加</span>
              </button>
            </div>

            {/* 検索とフィルター */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 検索 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ファイル名や追加者で検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* フィルター */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">情報の種類</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | '自社情報' | '市場情報' | '競合情報' | 'マクロトレンド')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors h-10"
                  >
                    <option value="all">すべて</option>
                    <option value="自社情報">自社情報</option>
                    <option value="市場情報">市場情報</option>
                    <option value="競合情報">競合情報</option>
                    <option value="マクロトレンド">マクロトレンド</option>
                  </select>
                </div>

                {/* 並び替え */}
                <div className="flex gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">並び替え</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'file_name' | 'file_type' | 'uploaded_by' | 'uploaded_at')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors h-10"
                    >
                      <option value="uploaded_at">アップロード日</option>
                      <option value="file_name">ファイル名</option>
                      <option value="file_type">情報の種類</option>
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

            {/* ファイル一覧 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ファイル名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        情報の種類
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        追加者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アップロード日
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedFiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          {searchTerm || filterType !== 'all' ? '検索結果が見つかりませんでした' : 'ファイルがまだありません'}
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedFiles.map((file) => (
                        <tr key={file.file_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{file.file_name}</div>
                                <div className="text-xs text-gray-500">{file.file_size}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              file.file_type === '自社情報' ? 'bg-blue-100 text-blue-800' :
                              file.file_type === '市場情報' ? 'bg-green-100 text-green-800' :
                              file.file_type === '競合情報' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {file.file_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{file.uploaded_by}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(file.uploaded_at).toLocaleDateString('ja-JP')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(file.file_id)}
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

      {/* ファイルアップロードモーダル */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">ファイルをアップロード</h2>
            
            <div className="space-y-6">
              {/* 情報の種類選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">情報の種類</label>
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value as '自社情報' | '市場情報' | '競合情報' | 'マクロトレンド')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors"
                >
                  <option value="自社情報">自社情報</option>
                  <option value="市場情報">市場情報</option>
                  <option value="競合情報">競合情報</option>
                  <option value="マクロトレンド">マクロトレンド</option>
                </select>
              </div>

              {/* ファイルアップロードエリア */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ファイルを選択</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-[#FFBB3F] bg-[#FFBB3F]/5' 
                      : 'border-gray-300 hover:border-[#FFBB3F]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      ファイルをドラッグ&ドロップするか、
                      <label className="text-[#FFBB3F] hover:text-orange-500 cursor-pointer">
                        <span className="underline">クリックして選択</span>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                      してください
                    </p>
                  </div>
                </div>
              </div>

              {/* 選択されたファイル一覧 */}
              {uploadedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">選択されたファイル</label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ボタン */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setUploadedFiles([])
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={uploadedFiles.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  アップロード
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 