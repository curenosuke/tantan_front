'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
// 追加: API呼び出し用関数をimport（後で作成）
import fetchInterviewToCanvas, { InterviewToCanvasResponse } from '@/api/fetchInterviewToCanvas'
import updateCanvasData from '@/api/updateCanvasData'

// --- リーンキャンバス型 ---
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

// --- ダミーデータ ---
// const dummyOriginalCanvas: LeanCanvas = { ... }
// const dummyUpdatedCanvas: LeanCanvas = { ... }
// const dummyInterviewMemo: InterviewMemo = { ... }

// --- インタビューメモ型 ---
interface InterviewMemo {
  interview_target: string
  interview_date: string
  interview_record: string
  interview_purpose: 'CPF' | 'PSF'
  uploaded_by: string
}
// const dummyInterviewMemo: InterviewMemo = { ... }

export default function InterviewReflectPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = params.id as string
  // note_idはURLクエリから取得
  const noteId = searchParams.get('note_id')

  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [originalCanvas, setOriginalCanvas] = useState<LeanCanvas | null>(null)
  const [updatedCanvas, setUpdatedCanvas] = useState<LeanCanvas | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // --- インタビューメモ ---
  const [interviewMemo, setInterviewMemo] = useState<InterviewMemo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showGoBackModal, setShowGoBackModal] = useState(false);

  useEffect(() => {
    if (!noteId) {
      // note_idが無い場合は最新のインタビューメモを取得してリダイレクト
      (async () => {
        try {
          const res = await fetch(`/projects/${projectId}/interview-notes`)
          const notes = await res.json()
          console.log('interview-notes response:', notes)
          if (notes && notes.length > 0 && (notes[0].note_id || notes[0].edit_id)) {
            // note_id優先、なければedit_id
            const latestNoteId = notes[0].note_id || notes[0].edit_id
            router.replace(`?note_id=${latestNoteId}`)
          } else {
            setError('インタビューメモが存在しません。')
            setLoading(false)
          }
        } catch (e) {
          setError('インタビューメモの取得に失敗しました')
          setLoading(false)
        }
      })()
      return
    }
    // API呼び出し
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const res: InterviewToCanvasResponse = await fetchInterviewToCanvas(Number(projectId), Number(noteId))
        if (!res.success) {
          setError(res.message || 'API取得に失敗しました')
          setLoading(false)
          return
        }
        // current_canvas, proposed_canvasをLeanCanvas型にマッピング
        setOriginalCanvas(mapToLeanCanvas(res.current_canvas))
        setUpdatedCanvas(mapToLeanCanvas(res.proposed_canvas))
        setLoading(false)
      } catch (e: any) {
        setError(e.message || 'API取得に失敗しました')
        setLoading(false)
      }
    })()
  }, [projectId, noteId])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (e) {
        // 必要ならエラー処理
      }
    };
    fetchUser();
  }, []);

  // useEffectでlocalStorage.getItem('interviewMemo')を取得し、interviewMemoにセットする処理を追加。
  useEffect(() => {
    const memo = localStorage.getItem('interviewMemo');
    if (memo) {
      setInterviewMemo(JSON.parse(memo));
    }
  }, []);

  // APIレスポンスのcanvasをLeanCanvas型に変換
  function mapToLeanCanvas(data: any): LeanCanvas {
    if (!data) return {
      problem: '', existing_alternatives: '', solution: '', key_metrics: '', unique_value_proposition: '', high_level_concept: '', unfair_advantage: '', channels: '', customer_segments: '', early_adopters: '', cost_structure: '', revenue_streams: '', idea_name: ''
    }
    return {
      problem: data.problem || data.Problem || '',
      existing_alternatives: data.existing_alternatives || data.Existing_Alternatives || '',
      solution: data.solution || data.Solution || '',
      key_metrics: data.key_metrics || data.Key_Metrics || '',
      unique_value_proposition: data.unique_value_proposition || data.Unique_Value_Proposition || '',
      high_level_concept: data.high_level_concept || data.High_Level_Concept || '',
      unfair_advantage: data.unfair_advantage || data.Unfair_Advantage || '',
      channels: data.channels || data.Channels || '',
      customer_segments: data.customer_segments || data.Customer_Segments || '',
      early_adopters: data.early_adopters || data.Early_Adopters || '',
      cost_structure: data.cost_structure || data.Cost_Structure || '',
      revenue_streams: data.revenue_streams || data.Revenue_Streams || '',
      idea_name: data.idea_name || '',
    }
  }

  // --- キャンバス更新処理 ---
  async function handleUpdateCanvas() {
    if (!user || !updatedCanvas) {
      alert('ユーザー情報またはキャンバスデータが取得できませんでした')
      return
    }
    setIsUpdating(true)
    setShowConfirmModal(false)
    try {
      // update_category: 'interview' を必ず固定し、update_commentにインタビュー対象を反映
      const interviewTarget = interviewMemo?.interview_target || ''
      const updateComment = `インタビュー結果（${interviewTarget}）を反映`
      const result = await updateCanvasData(
        parseInt(projectId),
        user.user_id,
        updateComment,
        { ...updatedCanvas },
        'interview' // update_categoryを明示的に渡す
      )
      if (result && result.success) {
        alert('リーンキャンバスが更新されました')
        router.push(`/canvas/${projectId}`)
      } else {
        const errorMessage = result?.message || '更新に失敗しました。もう一度お試しください。'
        alert(errorMessage)
      }
    } catch (error) {
      console.error('更新中にエラーが発生しました:', error)
      alert('更新中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGoBack = () => {
    setShowGoBackModal(true);
  }
  const handleGoBackConfirm = () => {
    router.push(`/canvas/${projectId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          {/* AI思考アニメーション */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {/* 思考の波紋エフェクト */}
            <div className="absolute inset-0 w-20 h-20 border-2 border-[#FFBB3F] rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 w-20 h-20 border-2 border-orange-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AIが思考中...</h2>
          <p className="text-gray-600 mb-6">インタビューメモをキャンバスに反映しています</p>
          {/* プログレスバー */}
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto mb-4">
            <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 h-2 rounded-full animate-pulse"></div>
          </div>
          {/* 思考プロセス */}
          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>メモ内容を解析中...</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <span>キャンバス反映内容を生成中...</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                <span>最終反映を準備中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-medium">{error}</p>
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
        <Sidebar projectId={projectId} />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">インタビュー反映 - リーンキャンバス</h1>
              <p className="text-gray-600">インタビュー内容をもとにリーンキャンバスを更新します</p>
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
                  <p className="text-gray-600">更新前の状態です</p>
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

            {/* AIから提案された新しいリーンキャンバス */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">AIから提案された新しいリーンキャンバス</h2>
                  <p className="text-gray-600">インタビュー内容をもとにAIが提案した改善案です</p>
                </div>
              </div>
              {/* アイデア名 */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">アイデア名</div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-700 font-medium">{updatedCanvas.idea_name}</span>
                </div>
              </div>
              {/* メインキャンバス表示（AI提案） */}
              <div className="grid grid-cols-10 gap-2 auto-rows-min">
                {/* 1行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">顧客課題</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.problem}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">解決策</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.solution}</div>
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">独自の価値</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[8rem]">{updatedCanvas.unique_value_proposition}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">圧倒的優位性</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.unfair_advantage}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">顧客セグメント</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.customer_segments}</div>
                </div>
                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">代替品</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.existing_alternatives}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">主要指標</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.key_metrics}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">販路</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.channels}</div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">アーリーアダプター</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.early_adopters}</div>
                </div>
                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">費用構造</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.cost_structure}</div>
                </div>
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">収益の流れ</div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">{updatedCanvas.revenue_streams}</div>
                </div>
              </div>
            </div>

            {/* ボタン群 */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <button
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleUpdateCanvas}
                disabled={isUpdating}
              >
                キャンバスを更新
              </button>
              <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md" onClick={handleGoBack}>修正を反映しないで戻る</button>
            </div>

            {/* もとにしたインタビュー */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-400 text-white p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">もとにしたインタビュー</h3>
                  <p className="text-gray-500 text-sm">前ページで編集したインタビュー内容をそのまま記載します</p>
                </div>
              </div>
              {interviewMemo && (
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="mb-2 text-sm text-gray-700 font-bold">インタビュー対象: {interviewMemo.interview_target}</div>
                    <div className="mb-2 text-xs text-gray-500">実施日: {interviewMemo.interview_date} / 追加者: {interviewMemo.uploaded_by}</div>
                    <div className="whitespace-pre-line text-gray-700 text-sm">{interviewMemo.interview_record}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showGoBackModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-gray-400 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">本当に戻ってもよいですか？</h2>
              <p className="text-gray-700">修正内容は失われます。</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowGoBackModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md shadow-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleGoBackConfirm}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 