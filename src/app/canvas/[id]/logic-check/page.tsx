'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import fetchCanvasData from '@/api/fetchCanvasData'
import fetchConsistencyCheck, { ConsistencyCheckResponse } from '@/api/fetchConsistencyCheck'

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

export default function LogicCheckPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvasData, setCanvasData] = useState<LeanCanvas | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [consistencyCheckResult, setConsistencyCheckResult] = useState<ConsistencyCheckResponse | null>(null)

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          
          // 認証成功後、バックエンドからデータを取得
          const fetchedData = await fetchCanvasData(projectId)
          if (fetchedData) {
            setCanvasData(fetchedData)
          } else {
            // データが取得できない場合はダミーデータを使用
            setCanvasData(dummyCanvasData)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        console.error('認証チェックエラー:', err)
        // エラー時はダミーデータを使用
        setCanvasData(dummyCanvasData)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [projectId])

  const handleStartLogicCheck = () => {
    setShowConfirmModal(true)
  }

  const handleConfirm = async () => {
    setIsStarting(true)
    setShowConfirmModal(false)
    
    try {
      // 整合性確認APIを呼び出し
      const result = await fetchConsistencyCheck(projectId)
      
      if (result && result.success && result.analysis) {
        // 結果をローカルストレージに保存して、wall-hittingページで使用
        localStorage.setItem(`consistency-check-result-${projectId}`, JSON.stringify(result))
        setConsistencyCheckResult(result)
        
        // 壁打ちページに遷移
        router.push(`/canvas/${projectId}/logic-check/wall-hitting`)
      } else {
        alert('整合性確認の実行に失敗しました。もう一度お試しください。')
        setIsStarting(false)
      }
    } catch (error) {
      console.error('整合性確認エラー:', error)
      alert('整合性確認の実行中にエラーが発生しました。もう一度お試しください。')
      setIsStarting(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">論理チェック</h1>
              <p className="text-gray-600">リーンキャンバスの論理的整合性をチェックします</p>
            </div>

            {/* 確認メッセージ */}
            <div className="bg-gradient-to-r from-[#FFBB3F]/10 to-orange-50 border border-[#FFBB3F]/30 rounded-xl p-6 mb-6">
              <div className="flex items-center">
                <div className="bg-[#FFBB3F] text-white p-2 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">下記の内容で論理チェックをかけてもよろしいですか？</h2>
                  <p className="text-gray-600">リーンキャンバスの各要素間の論理的整合性をAIが分析します</p>
                </div>
              </div>
            </div>

            {/* リーンキャンバス表示 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-900 font-medium">{canvasData.idea_name}</span>
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
                    {canvasData.problem}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.solution}
                  </div>
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[8rem]">
                    {canvasData.unique_value_proposition}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.unfair_advantage}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.customer_segments}
                  </div>
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.existing_alternatives}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.key_metrics}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.channels}
                  </div>
                </div>
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.early_adopters}
                  </div>
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.cost_structure}
                  </div>
                </div>
                <div className="col-span-5 bg-white border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {canvasData.revenue_streams}
                  </div>
                </div>
              </div>
            </div>

            {/* 論理チェックスタートボタン */}
            <div className="flex justify-center">
              {isStarting ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg">
                    <div className="flex items-center space-x-3">
                      {/* AI思考アニメーション */}
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>AIが思考中...</span>
                    </div>
                  </div>
                  
                  {/* 思考プロセス表示 */}
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">AI分析プロセス</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">リーンキャンバスの各要素を分析中...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">論理的整合性をチェック中...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
                          <span className="text-sm text-gray-600">改善点を特定中...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                          <span className="text-sm text-gray-600">質問を生成中...</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 text-center">
                          AIがリーンキャンバスを深く分析して、<br />
                          論理的整合性の観点から改善点を特定しています
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStartLogicCheck}
                  className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
                >
                  論理チェックスタート
                </button>
              )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">論理チェックを開始します</h2>
              <p className="text-gray-700">
                リーンキャンバスの論理的整合性をAIが分析します。<br />
                この操作を実行してもよろしいですか？
              </p>
            </div>
            
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
                開始する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 