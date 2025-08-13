'use client'

import { useEffect, useState } from 'react'
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

export default function VersionPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const version = params.version as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvas, setCanvas] = useState<LeanCanvas | null>(null)
  const [overwriteReason, setOverwriteReason] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyCanvas: LeanCanvas = {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          // バックエンド未接続時はダミーデータを使用
          setCanvas(dummyCanvas)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setCanvas(dummyCanvas)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleOverwrite = () => {
    setShowConfirmModal(true)
  }

  const confirmOverwrite = () => {
    // バックエンド実装時は、指定されたバージョンを最新バージョンとして上書き
    console.log(`Overwriting with version: ${version}`)
    console.log(`Reason: ${overwriteReason}`)
    
    // 実際の実装では、バックエンドAPIを呼び出して上書き処理を実行
    // 成功後はhistoryページに戻る
    router.push(`/canvas/${projectId}/history`)
  }

  const handleGoBack = () => {
    router.push(`/canvas/${projectId}/history`)
  }

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = element.scrollHeight + 'px'
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
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {version} のリーンキャンバス
                  </h1>
                  <p className="text-gray-600">選択されたバージョンのリーンキャンバスを表示しています</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20">
                    {version}
                  </span>
                </div>
              </div>
            </div>

            {/* リーンキャンバス */}
            {canvas && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                {/* アイデア名ヘッダー */}
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                    アイデア名
                  </div>
                  <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                    <span className="text-gray-900 font-medium">{canvas.idea_name}</span>
                  </div>
                </div>

                {/* メインキャンバス表示 */}
                <div className="grid grid-cols-10 gap-2">
                  {/* 1行目 */}
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      顧客課題
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.problem}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      解決策
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.solution}
                    </div>
                  </div>
                  <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      独自の価値
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[8rem]">
                      {canvas.unique_value_proposition}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      圧倒的優位性
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.unfair_advantage}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      顧客セグメント
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.customer_segments}
                    </div>
                  </div>

                  {/* 2行目 */}
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      代替品
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.existing_alternatives}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      主要指標
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.key_metrics}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      販路
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.channels}
                    </div>
                  </div>
                  <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      アーリーアダプター
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.early_adopters}
                    </div>
                  </div>

                  {/* 3行目 */}
                  <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      費用構造
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.cost_structure}
                    </div>
                  </div>
                  <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                    <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                      収益の流れ
                    </div>
                    <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                      {canvas.revenue_streams}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 上書き理由入力 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">このバージョンを最新バージョンとして上書きする理由（任意）</h3>
              <textarea
                value={overwriteReason}
                onChange={(e) => setOverwriteReason(e.target.value)}
                placeholder="このバージョンを最新バージョンとして上書きする理由を入力してください（任意）"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] resize-none"
                rows={4}
                onInput={(e) => autoResizeTextarea(e.target as HTMLTextAreaElement)}
              />
            </div>

            {/* ボタン群 */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleOverwrite}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-107 hover:shadow-lg shadow-md"
              >
                このバージョンを最新バージョンとして上書き
              </button>
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                戻る
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
              <div className="bg-red-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">バージョンを上書きします</h2>
              <p className="text-gray-700">
                {version}を最新バージョンとして上書きします。<br />
                この操作は取り消すことができません。<br />
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
                onClick={confirmOverwrite}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                上書きする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 