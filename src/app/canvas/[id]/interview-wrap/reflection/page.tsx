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

interface InterviewMemo {
  memo_id: number
  interview_target: string
  interview_date: string
  interview_record: string
  interview_purpose: 'CPF' | 'PSF'
  uploaded_by: string
  created_at: string
  updated_at: string
}

interface AnalysisResult {
  field: keyof LeanCanvas
  before: string
  after: string
  reason: string
}

export default function InterviewReflectionPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [originalCanvas, setOriginalCanvas] = useState<LeanCanvas | null>(null)
  const [updatedCanvas, setUpdatedCanvas] = useState<LeanCanvas | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [interviewMemos, setInterviewMemos] = useState<InterviewMemo[]>([])
  const [currentMemo, setCurrentMemo] = useState<InterviewMemo | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyOriginalCanvas: LeanCanvas = {
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

  const dummyUpdatedCanvas: LeanCanvas = {
    problem: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化\n• 水管理の自動化ニーズの高まり",
    existing_alternatives: "• ベテラン農家の長年の経験と勘（人依存、再現性なし、若手・新規農家が活用困難）\n• 安価なアナログ・デジタル機器による手動記録・管理（データ断片化、記録・分析が煩雑、リアルタイム性が低い）\n• 既存のスマート農業ソリューション（高価格、複雑な操作、導入ハードルが高い）",
    solution: "• 土壌・気象・植物画像をリアルタイム測定する小型センシングデバイス\n• 作物生育・水管理・病害予測を可視化するスマートフォンアプリ\n• クラウドでの自動データ蓄積とAI農業アドバイス\n• 低コスト・低消費電力設計、太陽光発電対応\n• 段階的導入プランとリースオプション提供",
    key_metrics: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）\n• 農作物の収穫量向上率\n• 農作業時間短縮率\n• 農家の収益性向上率",
    unique_value_proposition: "使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。技術的優位性により、競合他社の半額以下での提供を実現。",
    high_level_concept: "使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。",
    unfair_advantage: "• 独自の超小型・低消費電力センサー技術（例：MEMS、画像センサー）\n• プリンターヘッド技術を活用した農業散布機器との統合可能性\n• 国内製造による品質・信頼性、全国販売網構築可能性\n• スマートグラス・AR技術との将来統合（例：独自MOVARIOスマートグラス）\n• 農業従事者との深い関係性と理解",
    channels: "• 地域農協（JA）との協業販売\n• 全国農業機械販売ルート\n• 段階的導入プランとリースオプション",
    customer_segments: "デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）",
    early_adopters: "日本国内の米・野菜農家で、デジタル化に前向きな40-60代の中小規模農家",
    cost_structure: "• センサー・ハードウェア開発・量産コスト\n• スマートフォンアプリ・クラウドプラットフォーム開発・運用\n• 顧客サポート・チャネル開発（営業・代理店）\n• 段階的導入支援コスト",
    revenue_streams: "• センサーデバイス販売（初期導入コスト）\n• 月額または年額SaaSダッシュボード利用料\n• リースオプションによる継続収益",
    idea_name: "精密農業向けスマート農業センシング&管理プラットフォーム"
  }

  const dummyAnalysisResults: AnalysisResult[] = [
    {
      field: 'problem',
      before: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題",
      after: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化\n• 水管理の自動化ニーズの高まり",
      reason: "インタビュー結果から、若手農家の技術習得に関する課題と水管理の自動化ニーズが追加されました。これにより、ターゲット層の課題がより具体的になりました。"
    },
    {
      field: 'customer_segments',
      before: "中小規模の農業従事者",
      after: "デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）",
      reason: "インタビュー結果から、より具体的なターゲット像を定義することで、マーケティング戦略が明確になります。"
    },
    {
      field: 'key_metrics',
      before: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）",
      after: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）\n• 農作物の収穫量向上率\n• 農作業時間短縮率\n• 農家の収益性向上率",
      reason: "インタビュー結果から成果指標を追加することで、ビジネスインパクトをより適切に測定できるようになります。"
    }
  ]

  const dummyInterviewMemos: InterviewMemo[] = [
    {
      memo_id: 1,
      interview_target: "農家Aさん（45歳、米作農家）",
      interview_date: "2024-01-15T14:30:00",
      interview_record: "現在の農業管理について詳しく聞きました。\n\n• 天候に依存した水管理で不安定\n• 経験に基づく判断が多い\n• 若手の技術継承が課題\n• スマート農業に興味はあるが、コストが懸念\n\n課題：\n• 水管理の自動化\n• データに基づく判断\n• 低コストな導入方法",
      interview_purpose: 'CPF',
      uploaded_by: 'のーち',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T16:45:00Z'
    }
  ]

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
          setOriginalCanvas(dummyOriginalCanvas)
          setUpdatedCanvas(dummyUpdatedCanvas)
          setAnalysisResults(dummyAnalysisResults)
          setInterviewMemos(dummyInterviewMemos)
          setCurrentMemo(dummyInterviewMemos[0]) // 最新のメモを設定
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        // エラー時もダミーデータを使用
        setOriginalCanvas(dummyOriginalCanvas)
        setUpdatedCanvas(dummyUpdatedCanvas)
        setAnalysisResults(dummyAnalysisResults)
        setInterviewMemos(dummyInterviewMemos)
        setCurrentMemo(dummyInterviewMemos[0]) // 最新のメモを設定
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

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
    
    // 本来はここでバックエンドAPIを呼び出す
    // 現在はデザイン確認用のダミー処理
    setTimeout(() => {
      alert('リーンキャンバスが更新されました（デザイン確認用）')
      setIsUpdating(false)
      router.push(`/canvas/${projectId}`)
    }, 1000)
  }

  const handleCancel = () => {
    setShowConfirmModal(false)
  }

  const handleGoBack = () => {
    if (confirm('修正を反映しないで戻りますか？')) {
      router.push(`/canvas/${projectId}/interview-wrap`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">インタビューメモ反映 - リーンキャンバスへの反映</h1>
              <p className="text-gray-600">インタビューメモの分析結果をリーンキャンバスに反映します</p>
            </div>

            {/* インタビューメモ分析結果セクション */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-[#FFBB3F] text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">インタビューメモ分析結果</h2>
                  <p className="text-gray-600">インタビューメモを基に、リーンキャンバスの改善点を分析しました</p>
                </div>
              </div>

              {/* 差分表示 */}
              <div className="space-y-6">
                {analysisResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-[#FFBB3F] text-white px-2 py-1 rounded text-xs font-bold mr-3">
                        {result.field === 'problem' && '顧客課題'}
                        {result.field === 'customer_segments' && '顧客セグメント'}
                        {result.field === 'key_metrics' && '主要指標'}
                        {result.field === 'solution' && '解決策'}
                        {result.field === 'unique_value_proposition' && '独自の価値'}
                        {result.field === 'unfair_advantage' && '圧倒的優位性'}
                        {result.field === 'channels' && '販路'}
                        {result.field === 'early_adopters' && 'アーリーアダプター'}
                        {result.field === 'cost_structure' && '費用構造'}
                        {result.field === 'revenue_streams' && '収益の流れ'}
                        {result.field === 'idea_name' && 'アイデア名'}
                      </div>
                      <span className="text-sm text-gray-600">改善提案</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">変更前</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 whitespace-pre-line">
                          {result.before}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">変更後</h4>
                        <div className="bg-green-50 p-3 rounded text-sm text-gray-800 whitespace-pre-line border border-green-200">
                          {result.after}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">改善理由</h4>
                      <p className="text-sm text-blue-700">{result.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 更新後のリーンキャンバス編集 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">更新後のリーンキャンバス</h2>
                  <p className="text-gray-600">以下の内容でキャンバスを更新します</p>
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

            {/* 参考：インタビューメモ */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-400 text-white p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">参考：インタビューメモ</h3>
                  <p className="text-gray-500 text-sm">以下のインタビューメモを基にAIが分析を行いました</p>
                </div>
              </div>

              {currentMemo && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mr-3">
                      {currentMemo.interview_target}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(currentMemo.interview_date)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-line">
                    {currentMemo.interview_record}
                  </div>
                </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">キャンバスを更新します</h2>
              <p className="text-gray-700">
                インタビュー結果を反映したリーンキャンバスを更新します。<br />
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