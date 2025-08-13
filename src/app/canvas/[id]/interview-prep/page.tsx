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
  version: string
}

type InterviewPurpose = 'CPF' | 'PSF'

export default function InterviewPrepPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [canvasData, setCanvasData] = useState<LeanCanvas | null>(null)
  const [interviewPurpose, setInterviewPurpose] = useState<InterviewPurpose>('CPF')

  // ダミーデータ（現在のリーンキャンバス）
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
    idea_name: "精密農業向けスマート農業センシング&管理プラットフォーム",
    version: "version3"
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

  const handleStartInterviewPrep = () => {
    // インタビュー準備確認ページに遷移
    router.push(`/canvas/${projectId}/interview-prep/result`)
  }

  const handleGoBack = () => {
    router.back()
  }

  const getPurposeDescription = (purpose: InterviewPurpose) => {
    switch (purpose) {
      case 'CPF':
        return '顧客と課題の整合確認'
      case 'PSF':
        return '課題とソリューションの整合確認'
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
      
      <div className="flex min-h-screen">
        {/* サイドバー */}
        <Sidebar projectId={projectId} />
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">インタビュー準備</h1>
              <p className="text-gray-600">最新のリーンキャンバスをもとにインタビュー項目を生成します</p>
            </div>

            {/* 確認メッセージ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">インタビュー対象のキャンバス</h2>
                  <p className="text-sm text-gray-600">
                    このリーンキャンバスの<span className="font-medium text-[#FFBB3F]">{canvasData.version}</span>をもとにインタビュー項目を生成してもよろしいですか？
                  </p>
                </div>
              </div>
            </div>

            {/* 現在のリーンキャンバス表示 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              {/* バージョン表示 */}
              <div className="flex items-center mb-4">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20">
                  {canvasData.version}
                </span>
              </div>

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

            {/* インタビュー目的選択 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">インタビューの目的</h2>
                  <p className="text-sm text-gray-600">
                    今回のインタビューの目的を選択してください
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="interview-purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  インタビューの目的
                </label>
                <select
                  id="interview-purpose"
                  value={interviewPurpose}
                  onChange={(e) => setInterviewPurpose(e.target.value as InterviewPurpose)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors bg-white"
                >
                  <option value="CPF">CPF検証（顧客と課題の整合確認）</option>
                  <option value="PSF">PSF検証（課題とソリューションの整合確認）</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  {interviewPurpose === 'CPF' ? 'CPF検証について' : 'PSF検証について'}
                </h3>
                <p className="text-sm text-blue-700">
                  {interviewPurpose === 'CPF' 
                    ? '顧客（Customer）と課題（Problem）の整合性を確認します。想定している顧客が本当にその課題を持っているか、その課題が本当に痛みを伴うものかを検証します。'
                    : '課題（Problem）とソリューション（Solution）の整合性を確認します。提案するソリューションが本当にその課題を解決できるか、顧客がそのソリューションを求めるかを検証します。'
                  }
                </p>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-center">
              <button
                onClick={handleStartInterviewPrep}
                className="px-8 py-3 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
              >
                インタビュー項目生成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 