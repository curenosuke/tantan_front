'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function CanvasViewPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvasData, setCanvasData] = useState<LeanCanvas | null>(null)

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

  const handleDownloadPDF = () => {
    // PDFダウンロード機能（デザイン確認用）
    alert('PDFダウンロード機能（デザイン確認用）')
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">リーンキャンバス</h1>
              </div>
              
              {/* ダウンロードボタン */}
              <button
                onClick={handleDownloadPDF}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 border border-gray-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>キャンバスをダウンロード</span>
              </button>
            </div>

            {/* リーンキャンバス */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-900 font-medium">
                    {canvasData.idea_name}
                  </span>
                </div>
              </div>

              {/* メインキャンバス */}
              <div className="grid grid-cols-10 gap-2">
                {/* 1行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客課題
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.problem}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.solution}
                  </p>
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.unique_value_proposition}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.unfair_advantage}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.customer_segments}
                  </p>
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.existing_alternatives}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.key_metrics}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.channels}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.early_adopters}
                  </p>
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.cost_structure}
                  </p>
                </div>
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.revenue_streams}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 