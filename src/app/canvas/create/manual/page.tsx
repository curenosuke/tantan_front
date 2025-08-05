'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'

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
  id: keyof LeanCanvas
  title: string
  question: string
  placeholder: string
}

export default function ManualCanvasPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [canvasData, setCanvasData] = useState<LeanCanvas>({
    problem: '',
    existing_alternatives: '',
    solution: '',
    key_metrics: '',
    unique_value_proposition: '',
    high_level_concept: '',
    unfair_advantage: '',
    channels: '',
    customer_segments: '',
    early_adopters: '',
    cost_structure: '',
    revenue_streams: '',
    idea_name: ''
  })

  const questions: Question[] = [
    {
      id: 'customer_segments',
      title: '顧客セグメント',
      question: 'あなたのビジネスの主要な顧客セグメントは誰ですか？',
      placeholder: '例：中小規模の農業従事者、20-30代のSNSユーザーなど'
    },
    {
      id: 'problem',
      title: '顧客課題',
      question: 'あなたのビジネスが解決しようとしている顧客の課題は何ですか？',
      placeholder: '例：高齢化と人手不足による収益性の低下、高額で複雑な機器の導入困難など'
    },
    {
      id: 'existing_alternatives',
      title: '代替品',
      question: '現在、顧客がこの課題を解決するために使用している代替手段は何ですか？',
      placeholder: '例：ベテラン農家の長年の経験と勘、安価なアナログ機器による手動記録など'
    },
    {
      id: 'early_adopters',
      title: 'アーリーアダプター',
      question: 'あなたのビジネスの初期採用者（アーリーアダプター）は誰ですか？',
      placeholder: '例：日本国内の米・野菜農家、ミニマリスト、SNS疲れを感じている人など'
    },
    {
      id: 'unique_value_proposition',
      title: '独自の価値',
      question: 'あなたのビジネスの独自の価値提案は何ですか？',
      placeholder: '例：「使いやすい」スマート農業ソリューション。手頃な価格で高性能な環境センサーを提供'
    },
    {
      id: 'solution',
      title: '解決策',
      question: 'あなたのビジネスはどのようにこの課題を解決しますか？',
      placeholder: '例：土壌・気象・植物画像をリアルタイム測定する小型センシングデバイスなど'
    },
    {
      id: 'channels',
      title: '販路',
      question: 'あなたのビジネスはどのような販路を通じて顧客にリーチしますか？',
      placeholder: '例：地域農協（JA）との協業販売、全国農業機械販売ルートなど'
    },
    {
      id: 'revenue_streams',
      title: '収益の流れ',
      question: 'あなたのビジネスの収益源は何ですか？',
      placeholder: '例：センサーデバイス販売（初期導入コスト）、月額または年額SaaSダッシュボード利用料など'
    },
    {
      id: 'cost_structure',
      title: '費用構造',
      question: 'あなたのビジネスの主要なコストは何ですか？',
      placeholder: '例：センサー・ハードウェア開発・量産コスト、スマートフォンアプリ・クラウドプラットフォーム開発・運用など'
    },
    {
      id: 'key_metrics',
      title: '主要指標',
      question: 'あなたのビジネスの成功を測る主要な指標は何ですか？',
      placeholder: '例：センサー導入台数、SaaS継続率、アプリ利用率など'
    },
    {
      id: 'unfair_advantage',
      title: '圧倒的優位性',
      question: 'あなたのビジネスが持つ競合他社が真似できない優位性は何ですか？',
      placeholder: '例：独自の超小型・低消費電力センサー技術、国内製造による品質・信頼性など'
    },
    {
      id: 'idea_name',
      title: 'アイデア名',
      question: 'あなたのビジネスアイデアの名前を教えてください',
      placeholder: '例：精密農業向けスマート農業センシング&管理プラットフォーム'
    }
  ]

  useEffect(() => {
    // ログイン状態をチェック
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
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

  const handleAnswerChange = (value: string) => {
    const currentQuestion = questions[currentStep]
    setCanvasData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  const handleComplete = async () => {
    // 本来はここでバックエンドAPIを呼び出す
    // 現在はデザイン確認用のダミー処理
    alert('リーンキャンバスが保存されました（デザイン確認用）')
    // first-checkページに移動
    window.location.href = '/canvas/first-check'
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

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* ヘッダー部分 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">キャンバスの入力</h1>
            <p className="text-gray-600 text-lg font-medium">リーンキャンバスの各項目を順番に入力してください</p>
          </div>

          {/* フロー表示 */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6 mb-6">
            <div className="flex justify-center px-8">
              <div className="flex items-end space-x-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-700 mb-2 text-center max-w-20">
                      {question.title}
                    </div>
                    <button
                      onClick={() => handleStepClick(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white shadow-md'
                          : index < currentStep
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-500 hover:bg-gray-400'
                      }`}
                    >
                      {index < currentStep ? '✓' : index + 1}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="space-y-8">
            {/* 質問・回答エリア */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
                <p className="text-gray-700 text-lg">{currentQuestion.question}</p>
              </div>

              <div className="mb-6">
                <textarea
                  value={canvasData[currentQuestion.id]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full h-32 p-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-[#FFBB3F] focus:border-[#FFBB3F] transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 transform ${
                    currentStep === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-md'
                  }`}
                >
                  戻る
                </button>

                {currentStep === questions.length - 1 ? (
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3 rounded-full text-base font-medium bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300 transform"
                  >
                    完了
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-full text-base font-medium bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300 transform"
                  >
                    次へ
                  </button>
                )}
              </div>
              
              {/* 保存して入力完了ボタン */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 rounded-full text-base font-medium bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300 transform"
                >
                  入力完了
                </button>
              </div>
            </div>

            {/* リーンキャンバスプレビュー */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">リーンキャンバスプレビュー</h3>
              
              {/* アイデア名ヘッダー */}
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-l-xl text-base font-bold shadow-md">
                  アイデア名
                </div>
                <div className="bg-white border border-orange-200 px-6 py-3 rounded-r-xl flex-1 shadow-sm">
                  <span className="text-gray-900 font-medium">
                    {canvasData.idea_name || '未入力'}
                  </span>
                </div>
              </div>

              {/* メインキャンバス */}
              <div className="grid grid-cols-10 gap-2">
                {/* 1行目 */}
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客課題
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.problem || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    解決策
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.solution || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 row-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    独自の価値
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.unique_value_proposition || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    圧倒的優位性
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.unfair_advantage || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    顧客セグメント
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.customer_segments || '未入力'}
                  </p>
                </div>

                {/* 2行目 */}
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    代替品
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.existing_alternatives || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    主要指標
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.key_metrics || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    販路
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.channels || '未入力'}
                  </p>
                </div>
                <div className="col-span-2 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    アーリーアダプター
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.early_adopters || '未入力'}
                  </p>
                </div>

                {/* 3行目 */}
                <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    費用構造
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.cost_structure || '未入力'}
                  </p>
                </div>
                <div className="col-span-5 bg-white border border-orange-200 rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-[#FFBB3F]/30 to-orange-50 border border-[#FFBB3F]/50 text-orange-700 w-full py-2 rounded-lg text-xs font-bold mb-3 text-center shadow-sm">
                    収益の流れ
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {canvasData.revenue_streams || '未入力'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 