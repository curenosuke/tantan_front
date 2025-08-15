'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface InterviewResult {
  purpose: string
  interviewItems: InterviewItem[]
  idealInterviewee: IdealInterviewee
  interviewTips: string[]
}

interface InterviewItem {
  category: string
  questions: string[]
}

interface IdealInterviewee {
  attributes: string[]
  characteristics: string[]
  selectionCriteria: string[]
}

export default function InterviewPrepResultPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [interviewResult, setInterviewResult] = useState<InterviewResult | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyInterviewResult: InterviewResult = {
    purpose: 'CPF検証（顧客と課題の整合確認）',
    interviewItems: [
      {
        category: '顧客の基本情報',
        questions: [
          '現在の農業従事年数はどのくらいですか？',
          '主にどのような作物を栽培されていますか？',
          '農場の規模（耕作面積）はどのくらいですか？',
          '家族構成と農業従事者の人数を教えてください'
        ]
      },
      {
        category: '現在の課題と痛み',
        questions: [
          '農業で最も困っていることは何ですか？',
          'その課題はどのくらい前から感じていますか？',
          'その課題によってどのような影響を受けていますか？（収益、時間、体力的な負担など）',
          '現在どのような方法でその課題に対処していますか？',
          'その対処法で満足していますか？なぜですか？'
        ]
      },
      {
        category: '代替手段の利用状況',
        questions: [
          'スマート農業機器やデジタルツールを使用したことはありますか？',
          'それらのツールについてどのような印象を持っていますか？',
          '導入を検討したが断念した経験はありますか？その理由は？',
          '理想的な農業支援ツールとはどのようなものだと思いますか？'
        ]
      },
      {
        category: '価値観と意思決定要因',
        questions: [
          '農業で最も大切にしていることは何ですか？',
          '新しい技術やツールの導入を決める際、何を最も重視しますか？',
          '初期投資コストと長期的な効果、どちらを重視しますか？',
          '家族や周囲の農家の意見は意思決定に影響しますか？'
        ]
      }
    ],
    idealInterviewee: {
      attributes: [
        '中小規模農家（耕作面積5-20ha）',
        '40-60代の農業従事者',
        'デジタル化に前向きな方',
        '現在の農業手法に課題を感じている方',
        '継続的な農業経営を目指している方'
      ],
      characteristics: [
        '現在の農業手法に限界を感じている',
        '効率化や省力化に関心がある',
        '新しい技術の導入に抵抗が少ない',
        '農業経営の改善意欲が高い',
        '家族や周囲の農家との情報共有が活発'
      ],
      selectionCriteria: [
        '過去にスマート農業機器の導入を検討した経験がある',
        '現在の農業手法で課題を感じている',
        'デジタルツールの使用経験がある（スマートフォン、タブレット等）',
        '農業経営の継続性を重視している',
        '地域の農家との交流が活発'
      ]
    },
    interviewTips: [
      '相手の話を遮らず、十分に聞き出す',
      '具体的なエピソードや体験談を引き出す',
      '感情的な反応や表情の変化を観察する',
      '仮説を検証する質問ではなく、事実確認の質問をする',
      '相手の価値観や背景を理解する質問を心がける',
      'インタビュー時間は30-45分を目安にする',
      '録音の許可を事前に得ておく',
      'メモを取る際は相手の話を止めないよう配慮する'
    ]
  }

  // 文字列から```jsonや```を除去する関数
  function cleanJSONString(str: string) {
    if (!str) return str;
    return str.replace(/```json|```/g, '').trim();
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
          // sessionStorageからAPI結果を取得
          const resultStr = sessionStorage.getItem('interview-prep-result')
          console.log('sessionStorageから取得:', resultStr)
          if (resultStr) {
            const result = JSON.parse(resultStr)
            console.log('パース後:', result)
            // interviewee, questionsもconsole.log
            console.log('interviewee:', result.interviewee)
            console.log('questions:', result.questions)
            let intervieweeObj = null
            let questionsObj = null
            try {
              intervieweeObj = JSON.parse(cleanJSONString(result.interviewee));
              console.log('intervieweeObj:', intervieweeObj)
            } catch (e) {
              console.error('intervieweeのパース失敗', e, result.interviewee)
            }
            try {
              questionsObj = JSON.parse(cleanJSONString(result.questions));
              console.log('questionsObj:', questionsObj)
            } catch (e) {
              console.error('questionsのパース失敗', e, result.questions)
            }
            setInterviewResult({
              purpose: result.purpose,
              interviewItems: questionsObj
                ? [
                    { category: '顧客の基本情報', questions: questionsObj['顧客の基本情報'] || [] },
                    { category: '現在の課題と痛み', questions: questionsObj['現在の課題と痛み'] || [] },
                    { category: '代替手段の利用状況', questions: questionsObj['代替手段の利用状況'] || [] },
                    { category: '価値観と意思決定要因', questions: questionsObj['価値観と意思決定要因'] || [] },
                  ]
                : [],
              idealInterviewee: intervieweeObj
                ? {
                    attributes: intervieweeObj['属性'] || [],
                    characteristics: intervieweeObj['特徴'] || [],
                    selectionCriteria: intervieweeObj['選定基準'] || [],
                  }
                : { attributes: [], characteristics: [], selectionCriteria: [] },
              interviewTips: [
                '相手の話を遮らず、十分に聞き出す',
                '具体的なエピソードや体験談を引き出す',
                '感情的な反応や表情の変化を観察する',
                '仮説を検証する質問ではなく、事実確認の質問をする',
                '相手の価値観や背景を理解する質問を心がける',
                'インタビュー時間は30-45分を目安にする',
                '録音の許可を事前に得ておく',
                'メモを取る際は相手の話を止めないよう配慮する',
              ],
            })
          } else {
            setInterviewResult(dummyInterviewResult)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        setInterviewResult(dummyInterviewResult)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleGoBack = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmGoBack = () => {
    setShowConfirmModal(false)
    router.push(`/canvas/${projectId}/interview-prep`)
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

  if (!interviewResult) {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">インタビュー準備結果</h1>
              <p className="text-gray-600">AIが生成したインタビュー項目と理想的なインタビューイー情報</p>
            </div>

            {/* インタビュー目的 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-[#FFBB3F] text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">インタビューの目的</h2>
                  <p className="text-gray-600">{interviewResult.purpose}</p>
                </div>
              </div>
            </div>

            {/* インタビュー項目 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">インタビュー項目</h2>
                  <p className="text-gray-600">効果的なインタビューを行うための質問項目</p>
                </div>
              </div>

              <div className="space-y-6">
                {interviewResult.interviewItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#FFBB3F] text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {item.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-start">
                          <div className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {qIndex + 1}
                          </div>
                          <p className="text-gray-700 flex-1">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 理想的なインタビューイー */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">理想的なインタビューイー</h2>
                  <p className="text-gray-600">効果的なインタビューを行うための対象者情報</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 属性 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="bg-[#FFBB3F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      1
                    </div>
                    属性
                  </h3>
                  <ul className="space-y-2">
                    {interviewResult.idealInterviewee.attributes.map((attr, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-[#FFBB3F] w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{attr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 特徴 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="bg-[#FFBB3F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      2
                    </div>
                    特徴
                  </h3>
                  <ul className="space-y-2">
                    {interviewResult.idealInterviewee.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-[#FFBB3F] w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 選定基準 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="bg-[#FFBB3F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                      3
                    </div>
                    選定基準
                  </h3>
                  <ul className="space-y-2">
                    {interviewResult.idealInterviewee.selectionCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-[#FFBB3F] w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* インタビューのコツ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-purple-500 text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">インタビューのコツ</h2>
                  <p className="text-gray-600">効果的なインタビューを実施するためのポイント</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewResult.interviewTips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ボタン群 */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                確認して戻る
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
              <div className="bg-[#FFBB3F] text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">本当に戻りますか？</h2>
              <p className="text-gray-700">
                戻るとこの結果を参照できなくなりますが、よろしいですか？
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
                onClick={handleConfirmGoBack}
                className="flex-1 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg shadow-md"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 