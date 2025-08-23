'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import fetchItem from '@/api/fetchItem'

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

export default function FirstCheckAigenPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvasData, setCanvasData] = useState<LeanCanvas | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 初期データ取得（AI生成データをlocalStorageから取得する想定）
  useEffect(() => {
    // ログイン状態をチェック
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
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }
    checkAuth()

    // AI生成データをsessionStorageから取得し、LeanCanvas型にマッピング
    try {
      const savedData = sessionStorage.getItem('generatedCanvas')
      if (savedData) {
        const raw = JSON.parse(savedData)
        // プロパティ名変換
        setCanvasData({
          idea_name: raw.idea_name || '',
          problem: raw.Problem || '',
          existing_alternatives: raw.Existing_Alternatives || '',
          solution: raw.Solution || '',
          key_metrics: raw.Key_Metrics || '',
          unique_value_proposition: raw.Unique_Value_Proposition || '',
          high_level_concept: raw.High_Level_Concept || '',
          unfair_advantage: raw.Unfair_Advantage || '',
          channels: raw.Channels || '',
          customer_segments: raw.Customer_Segments || '',
          early_adopters: raw.Early_Adopters || '',
          cost_structure: raw.Cost_Structure || '',
          revenue_streams: raw.Revenue_Streams || ''
        })
      } else {
        // ダミーデータ
        setCanvasData({
          problem: "AI生成: 顧客課題例",
          existing_alternatives: "AI生成: 代替品例",
          solution: "AI生成: 解決策例",
          key_metrics: "AI生成: 主要指標例",
          unique_value_proposition: "AI生成: 独自の価値例",
          high_level_concept: "AI生成: ハイレベルコンセプト例",
          unfair_advantage: "AI生成: 圧倒的優位性例",
          channels: "AI生成: 販路例",
          customer_segments: "AI生成: 顧客セグメント例",
          early_adopters: "AI生成: アーリーアダプター例",
          cost_structure: "AI生成: 費用構造例",
          revenue_streams: "AI生成: 収益の流れ例",
          idea_name: "AI生成: アイデア名例"
        })
      }
    } catch (error) {
      setCanvasData(null)
    }
  }, [])

  // テキストエリアの自動リサイズ
  useEffect(() => {
    if (canvasData) {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        const target = textarea as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = Math.max(target.scrollHeight, 96) + 'px';
      });
    }
  }, [canvasData]);

  const handleCanvasChange = (field: keyof LeanCanvas, value: string) => {
    if (canvasData) {
      setCanvasData({
        ...canvasData,
        [field]: value
      })
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      if (!canvasData) throw new Error('データがありません')
      await fetchItem(canvasData)
      alert('AI生成リーンキャンバスが正常に保存されました！')
      window.location.href = '/canvas-list'
    } catch (error) {
      alert('保存に失敗しました。エラーを確認してください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !canvasData) {
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI生成リーンキャンバスの確認・修正</h1>
            <p className="text-orange-700 text-lg font-medium">AIが生成した内容を修正できます</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                アイデア名
              </div>
              <div className="bg-white border border-orange-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                <input
                  type="text"
                  value={canvasData.idea_name}
                  onChange={e => handleCanvasChange('idea_name', e.target.value)}
                  className="w-full text-gray-900 font-medium border-none outline-none bg-transparent placeholder-gray-400 focus:placeholder-gray-300 transition-colors"
                  placeholder="アイデア名を入力"
                />
              </div>
            </div>
            <div className="grid grid-cols-10 gap-2 auto-rows-min">
              {/* 1行目 */}
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  顧客課題
                </div>
                <textarea
                  value={canvasData.problem}
                  onChange={e => handleCanvasChange('problem', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="顧客課題を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  解決策
                </div>
                <textarea
                  value={canvasData.solution}
                  onChange={e => handleCanvasChange('solution', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="解決策を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 row-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  独自の価値
                </div>
                <textarea
                  value={canvasData.unique_value_proposition}
                  onChange={e => handleCanvasChange('unique_value_proposition', e.target.value)}
                  className="w-full min-h-[8rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="独自の価値を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  圧倒的優位性
                </div>
                <textarea
                  value={canvasData.unfair_advantage}
                  onChange={e => handleCanvasChange('unfair_advantage', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="圧倒的優位性を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  顧客セグメント
                </div>
                <textarea
                  value={canvasData.customer_segments}
                  onChange={e => handleCanvasChange('customer_segments', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="顧客セグメントを入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              {/* 2行目 */}
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  代替品
                </div>
                <textarea
                  value={canvasData.existing_alternatives}
                  onChange={e => handleCanvasChange('existing_alternatives', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="代替品を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  主要指標
                </div>
                <textarea
                  value={canvasData.key_metrics}
                  onChange={e => handleCanvasChange('key_metrics', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="主要指標を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  販路
                </div>
                <textarea
                  value={canvasData.channels}
                  onChange={e => handleCanvasChange('channels', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="販路を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  アーリーアダプター
                </div>
                <textarea
                  value={canvasData.early_adopters}
                  onChange={e => handleCanvasChange('early_adopters', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="アーリーアダプターを入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              {/* 3行目 */}
              <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  費用構造
                </div>
                <textarea
                  value={canvasData.cost_structure}
                  onChange={e => handleCanvasChange('cost_structure', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="費用構造を入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
              <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  収益の流れ
                </div>
                <textarea
                  value={canvasData.revenue_streams}
                  onChange={e => handleCanvasChange('revenue_streams', e.target.value)}
                  className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border-2 border-orange-200 hover:border-[#FFBB3F] rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-all duration-200 resize-none overflow-hidden bg-white hover:bg-gray-50 focus:bg-white"
                  placeholder="収益の流れを入力"
                  style={{ resize: 'none', overflow: 'hidden' }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-full text-base font-medium transition-all duration-300 transform ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white hover:scale-105 hover:shadow-lg shadow-md'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>保存中...</span>
                </div>
              ) : (
                <span>完了</span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
