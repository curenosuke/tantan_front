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

interface Question {
  id: number
  question: string
  answer: string
}

interface AnalysisResult {
  field: keyof LeanCanvas
  before: string
  after: string
  reason: string
}

export default function ReflectionPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [originalCanvas, setOriginalCanvas] = useState<LeanCanvas | null>(null)
  const [updatedCanvas, setUpdatedCanvas] = useState<LeanCanvas | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasAiProposal, setHasAiProposal] = useState(false)

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
    problem: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化",
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
      after: "• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化",
      reason: "ユーザーの回答から、若手農家の技術習得に関する課題が追加されました。これにより、ターゲット層の課題がより具体的になりました。"
    },
    {
      field: 'customer_segments',
      before: "中小規模の農業従事者",
      after: "デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）",
      reason: "より具体的なターゲット像を定義することで、マーケティング戦略が明確になります。"
    },
    {
      field: 'key_metrics',
      before: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）",
      after: "• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）\n• 農作物の収穫量向上率\n• 農作業時間短縮率\n• 農家の収益性向上率",
      reason: "成果指標を追加することで、ビジネスインパクトをより適切に測定できるようになります。"
    }
  ]

  const dummyQuestions: Question[] = [
    {
      id: 1,
      question: "あなたの解決策は、顧客課題のどの部分を最も効果的に解決しますか？具体的な因果関係を説明してください。",
      answer: "解決策は、高齢化と人手不足による収益性の低下という核心的な課題を、自動化とデータ駆動の意思決定支援により解決します。具体的には、経験に依存していた農業技術をデジタル化し、若手農家でもベテラン農家と同等の判断ができるようになります。"
    },
    {
      id: 2,
      question: "顧客セグメントとアーリーアダプターの定義に矛盾はありませんか？より具体的なターゲット像を描けますか？",
      answer: "顧客セグメントは「中小規模の農業従事者」と定義していますが、アーリーアダプターとして「日本国内の米・野菜農家」を挙げています。より具体的には、「デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）」と定義することで、ターゲットを明確化できます。"
    },
    {
      id: 3,
      question: "独自の価値提案と圧倒的優位性の関係性は明確ですか？競合他社との差別化要因は十分ですか？",
      answer: "独自の価値提案は「使いやすいスマート農業ソリューション」ですが、圧倒的優位性として「独自の超小型・低消費電力センサー技術」を挙げています。この技術的優位性が価値提案の「使いやすさ」と「手頃な価格」を支える具体的な仕組みをより明確に説明する必要があります。"
    },
    {
      id: 4,
      question: "収益の流れと費用構造のバランスは取れていますか？持続可能なビジネスモデルになっていますか？",
      answer: "収益の流れは「センサーデバイス販売」と「SaaS利用料」の2本柱ですが、初期導入コストが高く、農家の投資判断を阻害する可能性があります。段階的な導入プランやリースオプションの検討が必要です。また、SaaS継続率を高めるための価値提供の具体化も重要です。"
    },
    {
      id: 5,
      question: "主要指標は、ビジネスの成功を適切に測定できていますか？改善すべき指標はありますか？",
      answer: "主要指標として「センサー導入台数」「SaaS継続率」「アプリ利用率」を設定していますが、これらは投入指標とプロセス指標に偏っています。成果指標として「農作物の収穫量向上率」「農作業時間短縮率」「農家の収益性向上率」を追加することで、ビジネスインパクトをより適切に測定できます。"
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
          
          // ローカルストレージからwall-hittingの回答データを取得
          const userAnswersData = localStorage.getItem('userAnswersData')
          if (userAnswersData) {
            try {
              const parsedData = JSON.parse(userAnswersData)
              if (parsedData.questions) {
                setQuestions(parsedData.questions)
              } else {
                setQuestions(dummyQuestions)
              }
            } catch (error) {
              console.error('ユーザー回答データの解析エラー:', error)
              setQuestions(dummyQuestions)
            }
          } else {
            // 保存された回答がない場合はダミーデータを使用
            setQuestions(dummyQuestions)
          }
          
          // ローカルストレージからAIの更新案を取得
          const canvasUpdateResult = localStorage.getItem('canvasUpdateResult')
          let aiUpdatedCanvas: LeanCanvas | null = null
          
          console.log('ローカルストレージから取得したcanvasUpdateResult:', canvasUpdateResult)
          
          if (canvasUpdateResult) {
            try {
              const parsedResult = JSON.parse(canvasUpdateResult)
              console.log('パースされたAI更新案データ:', parsedResult)
              
              if (parsedResult.success && parsedResult.updated_canvas) {
                // AIから提案された更新後のキャンバスを構築
                aiUpdatedCanvas = {
                  problem: parsedResult.updated_canvas.Problem || parsedResult.updated_canvas.problem || "",
                  existing_alternatives: parsedResult.updated_canvas.Existing_Alternatives || parsedResult.updated_canvas.existing_alternatives || "",
                  solution: parsedResult.updated_canvas.Solution || parsedResult.updated_canvas.solution || "",
                  key_metrics: parsedResult.updated_canvas.Key_Metrics || parsedResult.updated_canvas.key_metrics || "",
                  unique_value_proposition: parsedResult.updated_canvas.Unique_Value_Proposition || parsedResult.updated_canvas.unique_value_proposition || "",
                  high_level_concept: parsedResult.updated_canvas.Unique_Value_Proposition || parsedResult.updated_canvas.unique_value_proposition || "",
                  unfair_advantage: parsedResult.updated_canvas.Unfair_Advantage || parsedResult.updated_canvas.unfair_advantage || "",
                  channels: parsedResult.updated_canvas.Channels || parsedResult.updated_canvas.channels || "",
                  customer_segments: parsedResult.updated_canvas.Customer_Segments || parsedResult.updated_canvas.customer_segments || "",
                  early_adopters: parsedResult.updated_canvas.Early_Adopters || parsedResult.updated_canvas.early_adopters || "",
                  cost_structure: parsedResult.updated_canvas.Cost_Structure || parsedResult.updated_canvas.cost_structure || "",
                  revenue_streams: parsedResult.updated_canvas.Revenue_Streams || parsedResult.updated_canvas.revenue_streams || "",
                  idea_name: parsedResult.updated_canvas.idea_name || ""
                }
                console.log('AIから提案された更新後のキャンバス:', aiUpdatedCanvas)
                setHasAiProposal(true)
              } else {
                console.log('AI更新案データが不正な形式です:', parsedResult)
                setHasAiProposal(false)
              }
            } catch (error) {
              console.error('AI更新案データの解析エラー:', error)
              setHasAiProposal(false)
            }
          } else {
            console.log('ローカルストレージにAI更新案データがありません')
            setHasAiProposal(false)
          }
          
          // 現在のプロジェクトのリーンキャンバスを取得
          try {
            const canvasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/latest`, {
              credentials: 'include',
            })
            
            if (canvasResponse.ok) {
              const canvasData = await canvasResponse.json()
              console.log('バックエンドから取得したデータ:', canvasData)
              
              // fetchCanvasDataと同じ方法でデータを処理
              if (canvasData && typeof canvasData === 'object') {
                // edit_idをキーとして持つオブジェクトから最初のデータを取得
                const editId = Object.keys(canvasData)[0]
                const canvasDetails = canvasData[editId]
                
                if (canvasDetails && typeof canvasDetails === 'object') {
                  // Lean Canvasデータを構築
                  const currentCanvas: LeanCanvas = {
                    problem: canvasDetails.problem || "",
                    existing_alternatives: canvasDetails.existing_alternatives || "",
                    solution: canvasDetails.solution || "",
                    key_metrics: canvasDetails.key_metrics || "",
                    unique_value_proposition: canvasDetails.unique_value_proposition || "",
                    high_level_concept: canvasDetails.high_level_concept || "",
                    unfair_advantage: canvasDetails.unfair_advantage || "",
                    channels: canvasDetails.channels || "",
                    customer_segments: canvasDetails.customer_segments || "",
                    early_adopters: canvasDetails.early_adopters || "",
                    cost_structure: canvasDetails.cost_structure || "",
                    revenue_streams: canvasDetails.revenue_streams || "",
                    idea_name: canvasDetails.idea_name || ""
                  }
                  
                  console.log('構築されたLean Canvasデータ:', currentCanvas)
                  setOriginalCanvas(currentCanvas)
                  
                  // 更新後のキャンバスはAIの提案があればそれを使用、なければ現在のキャンバスをベースに作成
                  if (aiUpdatedCanvas) {
                    setUpdatedCanvas(aiUpdatedCanvas)
                  } else {
                    // AIの提案がない場合は現在のキャンバスをベースに作成
                    setUpdatedCanvas(currentCanvas)
                  }
                } else {
                  // データが期待される形式でない場合はダミーデータを使用
                  console.log('バックエンドのデータ形式が期待と異なります。')
                  setOriginalCanvas(dummyOriginalCanvas)
                  setUpdatedCanvas(aiUpdatedCanvas || dummyUpdatedCanvas)
                }
              } else {
                // データが期待される形式でない場合はダミーデータを使用
                console.log('バックエンドのデータ形式が期待と異なります。')
                setOriginalCanvas(dummyOriginalCanvas)
                setUpdatedCanvas(aiUpdatedCanvas || dummyUpdatedCanvas)
              }
            } else {
              // バックエンドからデータが取得できない場合はダミーデータを使用
              console.log('バックエンドからのレスポンスが正常ではありません。')
              setOriginalCanvas(dummyOriginalCanvas)
              setUpdatedCanvas(aiUpdatedCanvas || dummyUpdatedCanvas)
            }
          } catch (error) {
            console.error('リーンキャンバス取得エラー:', error)
            // エラー時はダミーデータを使用
            setOriginalCanvas(dummyOriginalCanvas)
            setUpdatedCanvas(aiUpdatedCanvas || dummyUpdatedCanvas)
          }
          
          setAnalysisResults(dummyAnalysisResults)
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        console.error('認証エラー:', err)
        // エラー時もダミーデータを使用
        setOriginalCanvas(dummyOriginalCanvas)
        setUpdatedCanvas(dummyUpdatedCanvas)
        setAnalysisResults(dummyAnalysisResults)
        setQuestions(dummyQuestions)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [projectId])

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
    if (!user || !updatedCanvas) {
      alert('ユーザー情報またはキャンバスデータが取得できませんでした')
      return
    }

    setIsUpdating(true)
    setShowConfirmModal(false)
    
    try {
      // 新しいAPI関数を使用してバックエンドにデータを送信
      const result = await updateCanvasData(
        parseInt(projectId),
        user.user_id,
        '論理チェック結果を反映した更新',
        updatedCanvas as unknown as Record<string, string>,
        'consistency_check' // update_categoryを明示的に渡す
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">論理チェック - リーンキャンバスへの反映</h1>
              <p className="text-gray-600">AIの分析結果をリーンキャンバスに反映します</p>
            </div>



            {/* 更新前のリーンキャンバス表示 */}
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

              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-gray-100 border border-gray-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-700 font-medium">{originalCanvas.idea_name}</span>
                </div>
              </div>

              {/* メインキャンバス表示（読み取り専用） */}
              <div className="grid grid-cols-10 gap-2 auto-rows-min">
                {/* 1行目 */}
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客課題
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.problem}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.solution}
                  </div>
                </div>
                <div className="col-span-2 row-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[8rem]">
                    {originalCanvas.unique_value_proposition}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.unfair_advantage}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.customer_segments}
                  </div>
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.existing_alternatives}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.key_metrics}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.channels}
                  </div>
                </div>
                <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.early_adopters}
                  </div>
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.cost_structure}
                  </div>
                </div>
                <div className="col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-md">
                  <div className="bg-gradient-to-r from-gray-400/30 to-gray-50 border border-gray-400/50 text-gray-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line min-h-[6rem]">
                    {originalCanvas.revenue_streams}
                  </div>
                </div>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {hasAiProposal ? 'AIから提案された新しいリーンキャンバス' : '更新後のリーンキャンバス'}
                  </h2>
                  <p className="text-gray-600">
                    {hasAiProposal 
                      ? 'あなたの回答を基にAIが分析し、改善案を提案しました'
                      : 'AIの提案データが見つかりません。現在のキャンバスを編集してください。'
                    }
                  </p>
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
            <div className="flex items-center justify-center space-x-4 mb-12">
              <button
                onClick={handleUpdateCanvas}
                disabled={isUpdating}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUpdating ? '更新中...' : 'キャンバスを更新'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                修正を反映しないで戻る
              </button>
            </div>

            {/* 参考：ユーザーの回答 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-400 text-white p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">AIからの質問とあなたの回答</h3>
                  <p className="text-gray-500 text-sm">以下の回答を基にAIが分析を行いました</p>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start mb-3">
                      <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs font-bold mr-3 flex-shrink-0">
                        Q{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          {question.question}
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-line">
                          {question.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                論理チェック結果を反映したリーンキャンバスを更新します。<br />
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
                更新する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 