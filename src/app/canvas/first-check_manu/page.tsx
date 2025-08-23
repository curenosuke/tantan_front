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
}

export default function FirstCheckPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // データを取得する関数
  const getCanvasData = (): { ideaName: string; canvasData: LeanCanvas } => {
    try {
      const savedData = localStorage.getItem('leanCanvasData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        return {
          ideaName: parsedData.idea_name || "未入力",
          canvasData: {
            problem: parsedData.problem || "",
            existing_alternatives: parsedData.existing_alternatives || "",
            solution: parsedData.solution || "",
            key_metrics: parsedData.key_metrics || "",
            unique_value_proposition: parsedData.unique_value_proposition || "",
            high_level_concept: parsedData.high_level_concept || "",
            unfair_advantage: parsedData.unfair_advantage || "",
            channels: parsedData.channels || "",
            customer_segments: parsedData.customer_segments || "",
            early_adopters: parsedData.early_adopters || "",
            cost_structure: parsedData.cost_structure || "",
            revenue_streams: parsedData.revenue_streams || ""
          }
        }
      }
    } catch (error) {
      console.error('localStorageからデータを取得できませんでした:', error)
    }
    // データが取得できない場合はダミーデータを返す
    return {
      ideaName: "精密農業向けスマート農業センシング&管理プラットフォーム",
      canvasData: {
        problem: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題",
        existing_alternatives: "• ベテラン農家の長年の経験と勘（人依存、再現性なし、若手・新規農家が活用困難）\n• 安価なアナログ・デジタル機器による手動記録・管理（データ断片化、記録・分析が煩雑、リアルタイム性が低い）",
        solution: "• 土壌・気象・植物画像をリアルタイム測定する小型センシングデバイス\n• 作物生育・水管理・病害予測を可視化するスマートフォンアプリ\n• クラウドでの自動データ蓄積とAI農業アドバイス\n• 低コスト・低消費電力設計、太陽光発電対応",
        key_metrics: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）",
        unique_value_proposition: "「使いやすい」スマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。",
        high_level_concept: "「使いやすい」スマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。",
        unfair_advantage: "• 独自の超小型・低消費電力センサー技術（例：MEMS、画像センサー）\n• プリンターヘッド技術を活用した農業散布機器との統合可能性\n• 国内製造による品質・信頼性、全国販売網構築可能性\n• スマートグラス・AR技術との将来統合（例：独自MOVARIOスマートグラス）",
        channels: "• 地域農協（JA）との協業販売\n• 全国農業機械販売ルート",
        customer_segments: "中小規模の農業従事者",
        early_adopters: "日本国内の米・野菜農家",
        cost_structure: "• センサー・ハードウェア開発・量産コスト\n• スマートフォンアプリ・クラウドプラットフォーム開発・運用\n• 顧客サポート・チャネル開発（営業・代理店）",
        revenue_streams: "• センサーデバイス販売（初期導入コスト）\n• 月額または年額SaaSダッシュボード利用料"
      }
    }
  }

  // データを取得
  const { ideaName, canvasData } = getCanvasData()

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
  }, [])

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      console.log('handleComplete called, calling fetchItem...')
      // 現在表示されているデータを取得
      const currentData = getCanvasData()
      // fetchItem関数を呼び出してバックエンドAPIにPOST
      const result = await fetchItem({
        ...currentData.canvasData,
        idea_name: currentData.ideaName
      })
      console.log('Project created successfully:', result)
      alert('リーンキャンバスが正常に保存されました！')
      // 成功後、キャンバス一覧にリダイレクト
      window.location.href = '/canvas-list'
    } catch (error) {
      console.error('Error in handleComplete:', error)
      alert('保存に失敗しました。エラーを確認してください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (confirm('入力内容をリセットしますか？')) {
      // localStorageのデータをクリア
      localStorage.removeItem('leanCanvasData')
      alert('リセットされました。manualページに戻って入力し直してください。')
      // manualページに戻る
      window.location.href = '/canvas/create/manual'
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">リーンキャンバスの確認</h1>
            <p className="text-orange-700 text-lg font-medium">生成されたリーンキャンバスを確認してください</p>
          </div>
          {/* リーンキャンバス */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 mb-6">
            {/* アイデア名ヘッダー */}
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                アイデア名
              </div>
              <div className="bg-white border border-orange-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                <span className="text-gray-900 font-medium">{ideaName}</span>
              </div>
            </div>
            {/* メインキャンバス */}
            <div className="grid grid-cols-10 gap-2">
              {/* 1行目 */}
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  顧客課題
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.problem}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  解決策
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.solution}</p>
              </div>
              <div className="col-span-2 row-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  独自の価値
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{canvasData.unique_value_proposition}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  圧倒的優位性
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.unfair_advantage}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  顧客セグメント
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{canvasData.customer_segments}</p>
              </div>
              {/* 2行目 */}
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  代替品
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.existing_alternatives}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  主要指標
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.key_metrics}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  販路
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.channels}</p>
              </div>
              <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  アーリーアダプター
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{canvasData.early_adopters}</p>
              </div>
              {/* 3行目 */}
              <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  費用構造
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.cost_structure}</p>
              </div>
              <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                  収益の流れ
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{canvasData.revenue_streams}</p>
              </div>
            </div>
          </div>
          {/* ボタン */}
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
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              リセットして入力しなおす
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
