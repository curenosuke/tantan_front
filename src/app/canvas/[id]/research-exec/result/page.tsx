'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import updateCanvasData from '@/api/updateCanvasData'

interface LeanCanvas {
  problem: string
  existing_alternatives: string
  solution: string
  key_metrics: string
  unique_value_proposition: string
  high_level_concept: string
  unfair_advantage: string
  channels: string
  customer_segments: string
  early_adopters: string
  cost_structure: string
  revenue_streams: string
  idea_name: string
}

interface ResearchResult {
  field: keyof LeanCanvas
  field_japanese: string
  before: string
  after: string
  reason: string
}

export default function ResearchResultPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [originalCanvas, setOriginalCanvas] = useState<LeanCanvas | null>(null)
  const [updatedCanvas, setUpdatedCanvas] = useState<LeanCanvas | null>(null)
  const [researchResult, setResearchResult] = useState<string>('')
  const [updateProposal, setUpdateProposal] = useState<string>('')
  const [structuredUpdates, setStructuredUpdates] = useState<ResearchResult[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // データ取得エラー時のフォールバック用空データ
  const emptyCanvas: LeanCanvas = {
    problem: "",
    existing_alternatives: "",
    solution: "",
    key_metrics: "",
    unique_value_proposition: "",
    high_level_concept: "",
    unfair_advantage: "",
    channels: "",
    customer_segments: "",
    early_adopters: "",
    cost_structure: "",
    revenue_streams: "",
    idea_name: ""
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          
          // sessionStorageからリサーチ結果を取得（既に読み込み済みの場合はスキップ）
          if (!dataLoaded) {
            const storedResult = sessionStorage.getItem('researchResult')
            console.log('sessionStorage状況:', storedResult ? 'データあり' : 'データなし')
            if (storedResult) {
              try {
                const parsedResult = JSON.parse(storedResult)
                console.log('バックエンドから渡されたresearchResult:', parsedResult)
                setOriginalCanvas(parsedResult.canvas_data || emptyCanvas)
                setResearchResult(parsedResult.research_result || "リサーチ結果が見つかりませんでした。")
                setUpdateProposal(parsedResult.update_proposal || "更新提案が見つかりませんでした。")
                setStructuredUpdates(parsedResult.structured_updates || [])

                // 修正: update_proposalがJSON文字列の場合はパースし、proposed_canvasを優先
                let usedProposed = false;
                if (parsedResult.update_proposal) {
                  try {
                    const proposalObj = JSON.parse(parsedResult.update_proposal);
                    if (proposalObj.proposed_canvas) {
                      setUpdatedCanvas(proposalObj.proposed_canvas);
                      usedProposed = true;
                    }
                  } catch (e) {
                    // パース失敗時は何もしない
                  }
                }
                if (!usedProposed) {
                  if (parsedResult.proposed_canvas) {
                    setUpdatedCanvas(parsedResult.proposed_canvas);
                  } else {
                    const baseCanvas = parsedResult.canvas_data || emptyCanvas;
                    const updatedCanvasWithChanges = applyStructuredUpdatesToCanvas(
                      baseCanvas,
                      parsedResult.structured_updates || []
                    );
                    setUpdatedCanvas(updatedCanvasWithChanges);
                  }
                }

                setDataLoaded(true)
                
                // sessionStorageのクリアはページを離れる時に行う（useEffectの重複実行対策）
                // sessionStorage.removeItem('researchResult')
              } catch (error) {
                console.error('リサーチ結果の解析エラー:', error)
                // エラー時はリサーチ実行画面に戻る
                router.push(`/canvas/${projectId}/research-exec`)
              }
            } else {
              // データがない場合はリサーチ実行画面に戻る
              router.push(`/canvas/${projectId}/research-exec`)
            }
          }
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        console.error('初期化エラー:', err)
        // エラー時はリサーチ実行画面に戻る
        router.push(`/canvas/${projectId}/research-exec`)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [projectId, router])

  // 構造化された更新提案をキャンバスに適用する関数
  const applyStructuredUpdatesToCanvas = (baseCanvas: LeanCanvas, updates: ResearchResult[]) => {
    const newCanvas = { ...baseCanvas }
    
    // 各更新提案を適用
    updates.forEach(update => {
      if (update.field in newCanvas) {
        (newCanvas as any)[update.field] = update.after
      }
    })
    
    return newCanvas
  }

  const handleCanvasChange = (field: keyof LeanCanvas, value: string) => {
    if (updatedCanvas) {
      setUpdatedCanvas({
        ...updatedCanvas,
        [field]: value
      })
    }
  }

  // テキストエリアの自動リサイズ機能
  const autoResizeTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    target.style.height = 'auto'
    target.style.height = Math.max(target.scrollHeight, 96) + 'px' // 最小高さ6rem (96px)
  }

  // 初期表示時にテキストエリアの高さを調整
  useEffect(() => {
    if (updatedCanvas) {
      const textareas = document.querySelectorAll('textarea')
      textareas.forEach((textarea) => {
        const target = textarea as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = Math.max(target.scrollHeight, 96) + 'px'
      })
    }
  }, [updatedCanvas])

  const handleUpdateCanvas = () => {
    setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    setIsUpdating(true)
    setShowConfirmModal(false)
    
    try {
      if (updatedCanvas && user) {
        console.log('キャンバス更新開始:', projectId, updatedCanvas)
        const result = await updateCanvasData(
          parseInt(projectId), 
          user.user_id, 
          'リサーチ結果に基づく更新', 
          updatedCanvas as unknown as Record<string, string>, 
          'research'
        )
        console.log('キャンバス更新結果:', result)
        if (result && result.success) {
          alert('リーンキャンバスが更新されました')
          router.push(`/canvas/${projectId}`)
        } else {
          console.error('キャンバス更新失敗:', result)
          alert(`キャンバスの更新に失敗しました: ${(result && result.message) || '不明なエラー'}`)
        }
      } else {
        alert('ユーザー情報またはキャンバスデータが不足しています')
      }
    } catch (error: any) {
      console.error('キャンバス更新エラー:', error)
      alert(`キャンバスの更新中にエラーが発生しました: ${error.message || error}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
  }

  const handleGoBack = () => {
    router.push(`/canvas/${projectId}/research-exec`)
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

  if (!originalCanvas || !updatedCanvas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-medium">データが見つかりませんでした</p>
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
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">リサーチ実施 - 結果</h1>
              <p className="text-gray-600">リサーチ結果をリーンキャンバスに反映します</p>
            </div>

            {/* AIリサーチ結果セクション */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-[#FFBB3F] text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">AIリサーチ結果</h2>
                  <p className="text-gray-600">AIが実施したリサーチの詳細結果</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">{researchResult}</pre>
              </div>
            </div>

            {/* 更新前のリーンキャンバス */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-gray-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">更新前のリーンキャンバス</h2>
                  <p className="text-gray-600">最新バージョンのリーンキャンバスです</p>
                </div>
              </div>
              {/* アイデア名 */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">アイデア名</div>
                <div className="bg-gray-100 border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-700 font-medium">{originalCanvas.idea_name}</span>
                </div>
              </div>
              {/* メインキャンバス表示（更新前） */}
              <div className="grid grid-cols-10 gap-2 auto-rows-min">
                {/* 1行目 */}
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">顧客課題</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.problem}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">解決策</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.solution}</div>
                </div>
                <div className="col-span-2 row-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">独自の価値</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[8rem]">{originalCanvas.unique_value_proposition}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">圧倒的優位性</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.unfair_advantage}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">顧客セグメント</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.customer_segments}</div>
                </div>
                {/* 2行目 */}
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">代替品</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.existing_alternatives}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">主要指標</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.key_metrics}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">販路</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.channels}</div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">アーリーアダプター</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.early_adopters}</div>
                </div>
                {/* 3行目 */}
                <div className="col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">費用構造</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.cost_structure}</div>
                </div>
                <div className="col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">収益の流れ</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{originalCanvas.revenue_streams}</div>
                </div>
              </div>
            </div>

            {/* 更新後のリーンキャンバス編集 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">更新後のリーンキャンバス</h2>
                  <p className="text-gray-600">以下の内容でキャンバスを更新します（手動で編集可能）</p>
                </div>
              </div>
              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <input
                    type="text"
                    value={updatedCanvas.idea_name}
                    onChange={(e) => handleCanvasChange('idea_name', e.target.value)}
                    className="w-full text-gray-900 font-medium border-none outline-none"
                    placeholder="アイデア名を入力"
                  />
                </div>
              </div>
              {/* メインキャンバス編集 */}
              <div className="grid grid-cols-10 gap-2 auto-rows-min">
                {/* 1行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客課題
                  </div>
                  <textarea
                    value={updatedCanvas.problem}
                    onChange={(e) => handleCanvasChange('problem', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="顧客課題を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <textarea
                    value={updatedCanvas.solution}
                    onChange={(e) => handleCanvasChange('solution', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="解決策を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <textarea
                    value={updatedCanvas.unique_value_proposition}
                    onChange={(e) => handleCanvasChange('unique_value_proposition', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[8rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="独自の価値を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <textarea
                    value={updatedCanvas.unfair_advantage}
                    onChange={(e) => handleCanvasChange('unfair_advantage', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="圧倒的優位性を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <textarea
                    value={updatedCanvas.customer_segments}
                    onChange={(e) => handleCanvasChange('customer_segments', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="顧客セグメントを入力"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <textarea
                    value={updatedCanvas.existing_alternatives}
                    onChange={(e) => handleCanvasChange('existing_alternatives', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="代替品を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <textarea
                    value={updatedCanvas.key_metrics}
                    onChange={(e) => handleCanvasChange('key_metrics', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="主要指標を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <textarea
                    value={updatedCanvas.channels}
                    onChange={(e) => handleCanvasChange('channels', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="販路を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <textarea
                    value={updatedCanvas.early_adopters}
                    onChange={(e) => handleCanvasChange('early_adopters', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="アーリーアダプターを入力"
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <textarea
                    value={updatedCanvas.cost_structure}
                    onChange={(e) => handleCanvasChange('cost_structure', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="費用構造を入力"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <textarea
                    value={updatedCanvas.revenue_streams}
                    onChange={(e) => handleCanvasChange('revenue_streams', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="収益の流れを入力"
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* ボタン群 */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleUpdateCanvas}
                disabled={isUpdating}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUpdating ? '更新中...' : 'キャンバスを更新'}
              </button>
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                修正を反映しないで戻る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-[#FFBB3F] text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">キャンバスを更新します</h2>
              <p className="text-gray-700">
                リサーチ結果を反映したリーンキャンバスを更新します。<br />
                この操作を実行してもよろしいですか？
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md shadow-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                更新する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 