'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

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

export default function CanvasEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvasData, setCanvasData] = useState<LeanCanvas | null>(null)
  const [changeReason, setChangeReason] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyCanvasData: LeanCanvas = {
    problem: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題",
    existing_alternatives: "• ベテラン農家の長年の経験と勘（人依存、再現性なし、若手・新規農家が活用困難）\n• 安価なアナログ・デジタル機器による手動記録・管理（データ断片化、記録・分析が煩雑、リアルタイム性が低い）",
    solution: "• 土壌・気象・植物画像をリアルタイム測定する小型センシングデバイス\n• 作物生育・水管理・病害予測を可視化するスマートフォンアプリ\n• クラウドでの自動データ蓄積とAI農業アドバイス\n• 低コスト・低消費電力設計、太陽光発電対応",
    key_metrics: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）",
    unique_value_proposition: "使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。",
    high_level_concept: "使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。",
    unfair_advantage: "• 独自の超小型・低消費電力センサー技術（例：MEMS、画像センサー）\n• プリンターヘッド技術を活用した農業散布機器との統合可能性\n• 国内製造による品質・信頼性、全国販売網構築可能性\n• スマートグラス・AR技術との将来統合（例：独自MOVARIOスマートグラス）",
    channels: "• 地域農協（JA）との協業販売\n• 全国農業機械販売ルート",
    customer_segments: "中小規模の農業従事者",
    early_adopters: "日本国内の米・野菜農家",
    cost_structure: "• センサー・ハードウェア開発・量産コスト\n• スマートフォンアプリ・クラウドプラットフォーム開発・運用\n• 顧客サポート・チャネル開発（営業・代理店）",
    revenue_streams: "• センサーデバイス販売（初期導入コスト）\n• 月額または年額SaaSダッシュボード利用料",
    idea_name: "精密農業向けスマート農業センシング&管理プラットフォーム"
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
          // バックエンド未接続時はダミーデータを使用
          setCanvasData(dummyCanvasData)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setCanvasData(dummyCanvasData)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // 初期表示時にテキストエリアの高さを調整
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

  const handleSubmit = () => {
    setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setShowConfirmModal(false)
    
    // 本来はここでバックエンドAPIを呼び出す
    // 現在はデザイン確認用のダミー処理
    setTimeout(() => {
      alert('リーンキャンバスが更新されました（デザイン確認用）')
      setIsSubmitting(false)
      router.push(`/canvas/${projectId}`)
    }, 1000)
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
  }

  // テキストエリアの自動リサイズ関数
  const autoResizeTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = Math.max(target.scrollHeight, 96) + 'px'; // 最小高さ6rem (96px)
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

  if (!canvasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-medium">キャンバスが見つかりませんでした</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">リーンキャンバス編集</h1>
              <p className="text-gray-600">各項目を直接編集できます</p>
            </div>

            {/* リーンキャンバス編集フォーム */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <input
                    type="text"
                    value={canvasData.idea_name}
                    onChange={(e) => handleCanvasChange('idea_name', e.target.value)}
                    className="w-full text-gray-900 font-medium border-none outline-none"
                    placeholder="アイデア名を入力"
                  />
                </div>
              </div>

              {/* メインキャンバス編集 */}
              <div className="grid grid-cols-10 gap-2 auto-rows-min">
                {/* 1行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客課題
                  </div>
                  <textarea
                    value={canvasData.problem}
                    onChange={(e) => handleCanvasChange('problem', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="顧客課題を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <textarea
                    value={canvasData.solution}
                    onChange={(e) => handleCanvasChange('solution', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="解決策を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <textarea
                    value={canvasData.unique_value_proposition}
                    onChange={(e) => handleCanvasChange('unique_value_proposition', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[8rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="独自の価値を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <textarea
                    value={canvasData.unfair_advantage}
                    onChange={(e) => handleCanvasChange('unfair_advantage', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="圧倒的優位性を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <textarea
                    value={canvasData.customer_segments}
                    onChange={(e) => handleCanvasChange('customer_segments', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="顧客セグメントを入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <textarea
                    value={canvasData.existing_alternatives}
                    onChange={(e) => handleCanvasChange('existing_alternatives', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="代替品を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <textarea
                    value={canvasData.key_metrics}
                    onChange={(e) => handleCanvasChange('key_metrics', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="主要指標を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <textarea
                    value={canvasData.channels}
                    onChange={(e) => handleCanvasChange('channels', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="販路を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <textarea
                    value={canvasData.early_adopters}
                    onChange={(e) => handleCanvasChange('early_adopters', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="アーリーアダプターを入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <textarea
                    value={canvasData.cost_structure}
                    onChange={(e) => handleCanvasChange('cost_structure', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="費用構造を入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <textarea
                    value={canvasData.revenue_streams}
                    onChange={(e) => handleCanvasChange('revenue_streams', e.target.value)}
                    onInput={autoResizeTextarea}
                    className="w-full min-h-[6rem] p-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none overflow-hidden"
                    placeholder="収益の流れを入力"
                    style={{ resize: 'none', overflow: 'hidden' }}
                  />
                </div>
              </div>
            </div>

            {/* 変更理由 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">変更理由、変更のポイント（任意）</h3>
              <textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="w-full h-32 p-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none"
                placeholder="変更理由や変更のポイントがあれば入力してください"
              />
            </div>

            {/* 完了ボタン */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? '更新中...' : '完了'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">確認</h2>
            <p className="text-gray-700 mb-8 text-center">
              今のリーンキャンバスに本当に変更を加えてもいいですか？
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md shadow-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 