'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface InterviewMemo {
  memo_id?: number
  interview_target: string
  interview_date: string
  interview_record: string
  interview_purpose: 'CPF' | 'PSF'
  canvas_version: string
  uploaded_by: string
  created_at?: string
  updated_at?: string
}

type InterviewPurpose = 'CPF' | 'PSF'

export default function InterviewMemoEditPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  const memoId = searchParams.get('id')
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [memoData, setMemoData] = useState<InterviewMemo>({
    interview_target: '',
    interview_date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    interview_record: '',
    interview_purpose: 'CPF',
    canvas_version: 'version3',
    uploaded_by: ''
  })

  // ダミーデータ（編集時用）
  const dummyMemoData: InterviewMemo = {
    memo_id: 1,
    interview_target: "農家Aさん（45歳、米作農家）",
    interview_date: "2024-01-15T14:30:00",
    interview_record: "現在の農業管理について詳しく聞きました。\n\n• 天候に依存した水管理で不安定\n• 経験に基づく判断が多い\n• 若手の技術継承が課題\n• スマート農業に興味はあるが、コストが懸念\n\n課題：\n• 水管理の自動化\n• データに基づく判断\n• 低コストな導入方法",
    interview_purpose: 'CPF',
    canvas_version: 'version3',
    uploaded_by: 'のーち',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T16:45:00Z'
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          
          // 編集モードの場合、ダミーデータを読み込み
          if (memoId) {
            setMemoData(dummyMemoData)
          } else {
            // 新規作成モードの場合、ユーザー名を設定
            setMemoData(prev => ({
              ...prev,
              uploaded_by: userData.email || 'Unknown'
            }))
          }
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        if (memoId) {
          setMemoData(dummyMemoData)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [memoId])

  const handleInputChange = (field: keyof InterviewMemo, value: string) => {
    setMemoData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveAndReflect = async () => {
    setSaving(true)
    try {
      // バックエンド未接続時のデザイン確認用
      await new Promise(resolve => setTimeout(resolve, 1000)) // 保存処理の模擬
      alert('インタビューメモを保存し、キャンバスに反映しました（デザイン確認用）')
      router.push(`/canvas/${projectId}/interview-wrap/reflection`)
    } catch (err) {
      console.error('保存エラー:', err)
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // バックエンド未接続時のデザイン確認用
      await new Promise(resolve => setTimeout(resolve, 1000)) // 保存処理の模擬
      alert('インタビューメモを保存しました（デザイン確認用）')
      router.push(`/canvas/${projectId}/interview-wrap`)
    } catch (err) {
      console.error('保存エラー:', err)
      alert('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('保存せずに戻りますか？入力内容は失われます。')) {
      router.push(`/canvas/${projectId}/interview-wrap`)
    }
  }

  const getPurposeDescription = (purpose: InterviewPurpose) => {
    switch (purpose) {
      case 'CPF':
        return '顧客（Customer）と課題（Problem）の整合性を確認します。想定している顧客が本当にその課題を持っているか、その課題が本当に痛みを伴うものかを検証します。'
      case 'PSF':
        return '課題（Problem）とソリューション（Solution）の整合性を確認します。提案するソリューションが本当にその課題を解決できるか、顧客がそのソリューションを求めるかを検証します。'
      default:
        return ''
    }
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
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {memoId ? 'インタビューメモ編集' : 'インタビューメモ新規作成'}
              </h1>
              <p className="text-gray-600">
                {memoId ? 'インタビューメモを編集できます' : '実施したインタビューのメモを作成できます'}
              </p>
            </div>

            {/* フォーム */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-6">
                {/* インタビュー対象 */}
                <div>
                  <label htmlFor="interview-target" className="block text-sm font-medium text-gray-700 mb-2">
                    インタビュー対象 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="interview-target"
                    value={memoData.interview_target}
                    onChange={(e) => handleInputChange('interview_target', e.target.value)}
                    placeholder="例：淡々 啜（45歳、米作農家）"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors"
                  />
                </div>

                {/* インタビュー実施日 */}
                <div>
                  <label htmlFor="interview-date" className="block text-sm font-medium text-gray-700 mb-2">
                    インタビュー実施日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="interview-date"
                    value={memoData.interview_date}
                    onChange={(e) => handleInputChange('interview_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors"
                  />
                </div>

                {/* インタビューの目的 */}
                <div>
                  <label htmlFor="interview-purpose" className="block text-sm font-medium text-gray-700 mb-2">
                    インタビューの目的 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="interview-purpose"
                    value={memoData.interview_purpose}
                    onChange={(e) => handleInputChange('interview_purpose', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors bg-white"
                  >
                    <option value="CPF">CPF検証（顧客と課題の整合確認）</option>
                    <option value="PSF">PSF検証（課題とソリューションの整合確認）</option>
                  </select>
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      {getPurposeDescription(memoData.interview_purpose)}
                    </p>
                  </div>
                </div>

                {/* インタビュー記録 */}
                <div>
                  <label htmlFor="interview-record" className="block text-sm font-medium text-gray-700 mb-2">
                    インタビュー記録 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="interview-record"
                    value={memoData.interview_record}
                    onChange={(e) => handleInputChange('interview_record', e.target.value)}
                    placeholder="インタビューの内容を詳細に記録してください。&#10;&#10;例：&#10;• 現在の課題について&#10;• 解決策への反応&#10;• 価格感度&#10;• 導入への懸念点"
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-vertical"
                  />
                </div>

                {/* もとにしたバージョン（メモ用） */}
                <div>
                  <label htmlFor="canvas-version" className="block text-sm font-medium text-gray-700 mb-2">
                    もとにしたバージョン（メモ用）
                  </label>
                  <select
                    id="canvas-version"
                    value={memoData.canvas_version}
                    onChange={(e) => handleInputChange('canvas_version', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors bg-white"
                  >
                    <option value="">バージョン指定なし</option>
                    <option value="version1">version1</option>
                    <option value="version2">version2</option>
                    <option value="version3">version3</option>
                    <option value="version4">version4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                保存せずに戻る
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={handleSaveAndReflect}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? '保存中...' : '保存してキャンバスに反映'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 