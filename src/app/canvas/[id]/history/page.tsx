'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface CanvasVersion {
  version: string
  updated_at: string
  updated_by: string
  reason: 'direct_edit' | 'interview_reflection' | 'logic_check' | 'research_reflection'
  reason_description: string
  changes_summary: string
}

export default function HistoryPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [versions, setVersions] = useState<CanvasVersion[]>([])

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyVersions: CanvasVersion[] = [
    {
      version: "version4",
      updated_at: "2024-01-15T16:45:00Z",
      updated_by: "のーち",
      reason: "interview_reflection",
      reason_description: "農家Aさんへのインタビュー結果を反映",
      changes_summary: "顧客課題に若手農家の技術習得時間の長期化と水管理の自動化ニーズを追加。顧客セグメントをより具体的に定義。主要指標に成果指標を追加。"
    },
    {
      version: "version3",
      updated_at: "2024-01-14T14:30:00Z",
      updated_by: "かっさあ",
      reason: "logic_check",
      reason_description: "論理チェックの結果を反映",
      changes_summary: "独自の価値提案をより具体的に記述。圧倒的優位性に農業従事者との深い関係性を追加。販路に段階的導入プランを追加。"
    },
    {
      version: "version2",
      updated_at: "2024-01-13T10:15:00Z",
      updated_by: "のな",
      reason: "direct_edit",
      reason_description: "直接編集",
      changes_summary: "初回のリーンキャンバス作成。基本的な9つの要素を定義。"
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
          setVersions(dummyVersions)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setVersions(dummyVersions)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'direct_edit':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'interview_reflection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      case 'logic_check':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'research_reflection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'direct_edit':
        return 'bg-blue-500'
      case 'interview_reflection':
        return 'bg-green-500'
      case 'logic_check':
        return 'bg-purple-500'
      case 'research_reflection':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'direct_edit':
        return '直接編集'
      case 'interview_reflection':
        return 'インタビュー反映'
      case 'logic_check':
        return '論理チェック'
      case 'research_reflection':
        return 'リサーチ反映'
      default:
        return 'その他'
    }
  }

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

  const handleViewVersion = (version: string) => {
    // バックエンド実装時は、指定されたバージョンのキャンバスを表示
    console.log(`Viewing version: ${version}`)
    // 実際の実装では、指定されたバージョンのキャンバスを表示するページに遷移
    router.push(`/canvas/${projectId}/version/${version}`)
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
      
      <div className="flex">
        {/* サイドバー */}
        <Sidebar projectId={projectId} />
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ブラッシュアップヒストリー</h1>
              <p className="text-gray-600">リーンキャンバスの更新履歴を確認できます</p>
            </div>

            {/* タイムライン */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#FFBB3F] text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">更新履歴</h2>
                  <p className="text-gray-600">最新のバージョンから過去の履歴を表示しています</p>
                </div>
              </div>

              <div className="relative">
                {/* タイムラインの縦線 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* バージョン履歴 */}
                <div className="space-y-8">
                  {versions.map((version, index) => (
                    <div key={version.version} className="relative">
                      {/* タイムラインの丸いポイント */}
                      <div className="absolute left-4 top-4 w-4 h-4 bg-[#FFBB3F] rounded-full border-4 border-white shadow-md"></div>

                      {/* バージョン情報 */}
                      <div className="ml-12 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20">
                              {version.version}
                            </span>
                            <span className="text-sm text-gray-600">
                              更新者: {version.updated_by}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(version.updated_at)}
                          </span>
                        </div>

                        {/* 更新理由 */}
                        <div className="flex items-center mb-3">
                          <div className={`${getReasonColor(version.reason)} text-white p-2 rounded-full mr-3`}>
                            {getReasonIcon(version.reason)}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {getReasonLabel(version.reason)}
                            </span>
                            <p className="text-sm text-gray-600">
                              {version.reason_description}
                            </p>
                          </div>
                        </div>

                        {/* 変更内容 */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">変更内容</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {version.changes_summary}
                          </p>
                        </div>

                        {/* このバージョンを参照ボタン */}
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleViewVersion(version.version)}
                            className="inline-flex items-center bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            このバージョンを参照
                          </button>
                        </div>
                      </div>

                      {/* 最初のバージョン以外に矢印を表示 */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 初期作成ポイント */}
                <div className="relative mt-8">
                  <div className="absolute left-4 top-4 w-4 h-4 bg-gray-400 rounded-full border-4 border-white shadow-md"></div>
                  <div className="ml-12 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          version1
                        </span>
                        <span className="text-sm text-gray-600">
                          作成者: ふじさん
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        2024/01/13 09:00
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="bg-gray-500 text-white p-2 rounded-full mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          プロジェクト作成
                        </span>
                        <p className="text-sm text-gray-600">
                          リーンキャンバスの初期作成
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">作成内容</h4>
                      <p className="text-sm text-gray-600">
                        プロジェクトの基本設定とリーンキャンバスの初期テンプレートを作成しました。
                      </p>
                    </div>

                    {/* このバージョンを参照ボタン */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewVersion('version1')}
                        className="inline-flex items-center bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        このバージョンを参照
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 凡例 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">更新理由の凡例</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">直接編集</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">インタビュー反映</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">論理チェック</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">リサーチ反映</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 