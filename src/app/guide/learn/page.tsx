'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function LearnPage() {
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('what-is')
  const router = useRouter()

  useEffect(() => {
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
        // エラー時はそのままページを表示（開発時用）
        console.log('認証チェックでエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

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

  const sections = [
    { id: 'what-is', title: 'リーンキャンバスとは？', icon: '❓' },
    { id: 'nine-blocks', title: '9つのブロック', icon: '🧩' },
    { id: 'how-to-use', title: '運用方法', icon: '🚀' },
    { id: 'validation', title: '検証プロセス', icon: '✅' },
    { id: 'tips', title: '成功のコツ', icon: '💡' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* ページヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FFBB3F] to-orange-500 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">作り方を学ぶ</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            リーンキャンバスの基本から運用方法まで、ビジネスアイデアを成功に導くための知識を身につけましょう
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドナビ */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">目次</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              
              {/* リーンキャンバスとは？ */}
              {activeSection === 'what-is' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">❓ リーンキャンバスとは？</h2>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      リーンキャンバスは、アッシュ・マウリャによって開発されたビジネスモデルを1ページで可視化するフレームワークです。
                      スタートアップや新規事業において、アイデアを素早く整理し、仮説を立てて検証するために使用されます。
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">なぜリーンキャンバスが重要なのか？</h3>
                      <ul className="space-y-3 text-blue-800">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span><strong>素早い仮説立案：</strong>アイデアを体系的に整理し、重要な仮説を特定</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span><strong>リスクの最小化：</strong>大きな投資をする前に仮説を検証</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span><strong>チーム共通理解：</strong>関係者全員がビジネスモデルを理解</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span><strong>継続的改善：</strong>学習サイクルを通じてモデルを改善</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">従来のビジネスプランとの違い</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">従来のビジネスプラン</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 数十ページの詳細な計画書</li>
                            <li>• 作成に数週間〜数ヶ月</li>
                            <li>• 仮説の検証が困難</li>
                            <li>• 変更が困難で硬直的</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">リーンキャンバス</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 1ページのシンプルな構成</li>
                            <li>• 20分で初版を作成可能</li>
                            <li>• 仮説を明確に特定</li>
                            <li>• 継続的な更新・改善</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9つのブロック */}
              {activeSection === 'nine-blocks' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">🧩 9つのブロック</h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    リーンキャンバスは9つの重要な要素で構成されています。それぞれが相互に関連し合い、ビジネスモデル全体を形成しています。
                  </p>

                  {/* キャンバス図解 */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">リーンキャンバス構成図</h3>
                    <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
                      {/* 1行目 */}
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">1. 課題</h4>
                        <p className="text-xs text-gray-600">解決すべき問題</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">2. ソリューション</h4>
                        <p className="text-xs text-gray-600">課題の解決策</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">3. 独自の価値提案</h4>
                        <p className="text-xs text-gray-600">なぜ顧客が選ぶのか</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">4. 圧倒的な優位性</h4>
                        <p className="text-xs text-gray-600">真似できない強み</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">5. 顧客セグメント</h4>
                        <p className="text-xs text-gray-600">ターゲット顧客</p>
                      </div>
                      
                      {/* 2行目 */}
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">6. 既存の代替品</h4>
                        <p className="text-xs text-gray-600">競合・代替手段</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">7. 主要指標</h4>
                        <p className="text-xs text-gray-600">成功の測定方法</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">8. 販路</h4>
                        <p className="text-xs text-gray-600">顧客との接点</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm col-span-2">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">9. アーリーアダプター</h4>
                        <p className="text-xs text-gray-600">初期採用者の特徴</p>
                      </div>
                      
                      {/* 3行目 */}
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm col-span-2">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">費用構造</h4>
                        <p className="text-xs text-gray-600">主要なコスト</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm col-span-3">
                        <h4 className="font-semibold text-xs text-orange-700 mb-1">収益の流れ</h4>
                        <p className="text-xs text-gray-600">収益化の方法</p>
                      </div>
                    </div>
                  </div>

                  {/* 各ブロックの詳細説明 */}
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-3">🎯 課題 (Problem)</h4>
                        <p className="text-red-700 text-sm mb-3">ターゲット顧客が抱える解決すべき問題や痛みを明確に定義します。</p>
                        <p className="text-red-600 text-xs"><strong>記入のコツ：</strong>「〜ができなくて困っている」という形で具体的に</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">💡 ソリューション (Solution)</h4>
                        <p className="text-blue-700 text-sm mb-3">課題を解決するための具体的な解決策やプロダクトの機能を記述します。</p>
                        <p className="text-blue-600 text-xs"><strong>記入のコツ：</strong>課題に対応する機能を3つ以内で簡潔に</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">✨ 独自の価値提案 (Unique Value Proposition)</h4>
                      <p className="text-green-700 text-sm mb-3">
                        なぜ顧客があなたのプロダクトを選ぶべきなのか、競合と差別化できるポイントを一言で表現します。
                      </p>
                      <p className="text-green-600 text-xs"><strong>記入のコツ：</strong>「〜な人のための、〜ができる唯一の〜」の形で</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-3">🚀 圧倒的な優位性 (Unfair Advantage)</h4>
                        <p className="text-purple-700 text-sm mb-3">競合が簡単に真似できない、持続可能な競争優位性。</p>
                        <p className="text-purple-600 text-xs"><strong>例：</strong>特許、独占契約、ネットワーク効果、専門知識など</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-3">👥 顧客セグメント (Customer Segments)</h4>
                        <p className="text-yellow-700 text-sm mb-3">プロダクトを最も必要とする具体的な顧客グループ。</p>
                        <p className="text-yellow-600 text-xs"><strong>記入のコツ：</strong>年齢、職業、行動特性まで具体的に</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 運用方法 */}
              {activeSection === 'how-to-use' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">🚀 運用方法</h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    リーンキャンバスは一度作って終わりではありません。継続的に仮説を検証し、学びを元に更新していくことが重要です。
                  </p>

                  <div className="space-y-8">
                    {/* フェーズ1 */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">フェーズ1</span>
                        初期仮説の設定
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">やること</h4>
                          <ul className="space-y-2 text-blue-700">
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              20分でキャンバスの初版を作成
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              最もリスクの高い仮説を特定
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              チームで共有・ディスカッション
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">重要なポイント</h4>
                          <div className="bg-white rounded-lg p-4 border border-blue-300">
                            <p className="text-blue-700 text-sm">
                              完璧を目指さず、まずは現時点での仮説を書き出すことが大切です。
                              間違いを恐れずに、思考を可視化しましょう。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* フェーズ2 */}
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="text-xl font-semibold text-green-900 mb-4">
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm mr-3">フェーズ2</span>
                        仮説の検証
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-300">
                          <h4 className="font-medium text-green-800 mb-2">課題の検証</h4>
                          <p className="text-green-700 text-sm">顧客インタビューで課題が本当に存在するか確認</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-300">
                          <h4 className="font-medium text-green-800 mb-2">ソリューションの検証</h4>
                          <p className="text-green-700 text-sm">MVP（最小実用プロダクト）で解決策をテスト</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-300">
                          <h4 className="font-medium text-green-800 mb-2">市場の検証</h4>
                          <p className="text-green-700 text-sm">実際の需要と支払い意欲を確認</p>
                        </div>
                      </div>
                    </div>

                    {/* フェーズ3 */}
                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                      <h3 className="text-xl font-semibold text-orange-900 mb-4">
                        <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm mr-3">フェーズ3</span>
                        学習と改善
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-orange-800 mb-3">学習サイクル</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm mr-3">1</div>
                              <span className="text-orange-700">仮説を立てる</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm mr-3">2</div>
                              <span className="text-orange-700">実験で検証する</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm mr-3">3</div>
                              <span className="text-orange-700">結果から学習する</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-sm mr-3">4</div>
                              <span className="text-orange-700">キャンバスを更新する</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-800 mb-3">更新のタイミング</h4>
                          <ul className="space-y-2 text-orange-700">
                            <li>• 新しい学びが得られたとき</li>
                            <li>• 仮説が否定されたとき</li>
                            <li>• 新しい機会を発見したとき</li>
                            <li>• 市場環境が変化したとき</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 検証プロセス */}
              {activeSection === 'validation' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">✅ 検証プロセス</h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    リーンキャンバスの各要素を効果的に検証するための具体的な方法とプロセスを学びましょう。
                  </p>

                  <div className="space-y-8">
                    {/* CPF検証 */}
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h3 className="text-2xl font-semibold text-purple-900 mb-4">CPF検証（Customer-Problem Fit）</h3>
                      <p className="text-purple-700 mb-4">顧客と課題の適合性を検証します。想定している顧客が本当にその課題を持っているかを確認します。</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-purple-800 mb-3">検証方法</h4>
                          <ul className="space-y-2 text-purple-700">
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              顧客インタビュー（10-20人）
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              アンケート調査
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              行動観察
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              競合分析
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800 mb-3">成功の指標</h4>
                          <div className="bg-white rounded-lg p-4 border border-purple-300">
                            <ul className="space-y-1 text-purple-700 text-sm">
                              <li>• 70%以上が課題を認識</li>
                              <li>• 50%以上が「解決したい」と回答</li>
                              <li>• 現在の解決策に不満がある</li>
                              <li>• 解決にお金を払う意欲がある</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PSF検証 */}
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="text-2xl font-semibold text-green-900 mb-4">PSF検証（Problem-Solution Fit）</h3>
                      <p className="text-green-700 mb-4">課題とソリューションの適合性を検証します。提案するソリューションが本当に課題を解決できるかを確認します。</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-green-800 mb-3">検証方法</h4>
                          <ul className="space-y-2 text-green-700">
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              プロトタイプテスト
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              MVP（最小実用プロダクト）
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              A/Bテスト
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              ユーザビリティテスト
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-3">成功の指標</h4>
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <ul className="space-y-1 text-green-700 text-sm">
                              <li>• 80%以上が「使いたい」と回答</li>
                              <li>• 課題解決を実感できる</li>
                              <li>• 継続利用意向が高い</li>
                              <li>• 他人に推薦したいと思う</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PMF検証 */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-2xl font-semibold text-blue-900 mb-4">PMF検証（Product-Market Fit）</h3>
                      <p className="text-blue-700 mb-4">プロダクトと市場の適合性を検証します。市場に十分な需要があり、持続可能なビジネスが成り立つかを確認します。</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">検証方法</h4>
                          <ul className="space-y-2 text-blue-700">
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              実際の販売・有料ユーザー獲得
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              コホート分析
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              NPS（ネットプロモータースコア）調査
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              リテンション分析
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">成功の指標</h4>
                          <div className="bg-white rounded-lg p-4 border border-blue-300">
                            <ul className="space-y-1 text-blue-700 text-sm">
                              <li>• 40%以上が「非常にがっかり」（Sean Ellis Test）</li>
                              <li>• 月次継続率70%以上</li>
                              <li>• NPS 50以上</li>
                              <li>• 有機的な成長（バイラル効果）</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 成功のコツ */}
              {activeSection === 'tips' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 成功のコツ</h2>
                  
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    リーンキャンバスを効果的に活用し、ビジネスを成功に導くための実践的なコツとベストプラクティスをご紹介します。
                  </p>

                  <div className="space-y-8">
                    {/* DO */}
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="text-2xl font-semibold text-green-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        やるべきこと (DO)
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">🎯 具体的に書く</h4>
                            <p className="text-green-700 text-sm">「20代女性」ではなく「育児中の20代後半のワーキングマザー」のように具体的に記述する</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">⚡ 素早く作成する</h4>
                            <p className="text-green-700 text-sm">完璧を求めず、20分で初版を作成。その後継続的に改善していく</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">👥 チームで共有する</h4>
                            <p className="text-green-700 text-sm">関係者全員で内容を確認し、認識を合わせる</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">🔄 継続的に更新する</h4>
                            <p className="text-green-700 text-sm">新しい学びが得られるたびにキャンバスを更新する</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">📊 データで検証する</h4>
                            <p className="text-green-700 text-sm">仮説は必ず実データで検証する。感覚や推測に頼らない</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-300">
                            <h4 className="font-semibold text-green-800 mb-2">🎯 優先順位をつける</h4>
                            <p className="text-green-700 text-sm">最もリスクの高い仮説から順番に検証する</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DON'T */}
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h3 className="text-2xl font-semibold text-red-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        やってはいけないこと (DON'T)
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ 完璧主義</h4>
                            <p className="text-red-700 text-sm">最初から完璧なキャンバスを作ろうとしない。まずは書き出すことが重要</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ 思い込みで書く</h4>
                            <p className="text-red-700 text-sm">「きっと顧客は〜だろう」という推測で書かない。必ず検証する</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ 一度作って終わり</h4>
                            <p className="text-red-700 text-sm">キャンバスは生きた文書。継続的な更新を怠らない</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ 曖昧な表現</h4>
                            <p className="text-red-700 text-sm">「多くの人が」「便利な」などの抽象的な表現は避ける</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ すべてを同時に検証</h4>
                            <p className="text-red-700 text-sm">全ての仮説を一度に検証しようとしない。段階的に進める</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-red-300">
                            <h4 className="font-semibold text-red-800 mb-2">❌ 仮説に固執</h4>
                            <p className="text-red-700 text-sm">データが仮説を否定しても、執着せずに方向転換する</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* よくある失敗例 */}
                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                      <h3 className="text-2xl font-semibold text-yellow-900 mb-6">⚠️ よくある失敗例と対策</h3>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <h4 className="font-semibold text-yellow-800 mb-2">失敗例：ソリューション先行</h4>
                            <p className="text-yellow-700 text-sm mb-3">「この技術を使って何かできないか」と技術ありきで考えてしまう</p>
                            <div className="bg-yellow-100 rounded p-2">
                              <p className="text-yellow-800 text-xs"><strong>対策：</strong>まず課題から始める。顧客の痛みを理解してからソリューションを考える</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <h4 className="font-semibold text-yellow-800 mb-2">失敗例：機能の詰め込み</h4>
                            <p className="text-yellow-700 text-sm mb-3">「あれもこれも」と機能を詰め込みすぎてしまう</p>
                            <div className="bg-yellow-100 rounded p-2">
                              <p className="text-yellow-800 text-xs"><strong>対策：</strong>コア機能に絞る。「これがないと成り立たない」機能だけを残す</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <h4 className="font-semibold text-yellow-800 mb-2">失敗例：顧客セグメントが広すぎる</h4>
                            <p className="text-yellow-700 text-sm mb-3">「20代〜50代の男女」のようにターゲットが曖昧</p>
                            <div className="bg-yellow-100 rounded p-2">
                              <p className="text-yellow-800 text-xs"><strong>対策：</strong>最初は狭く設定。成功してから段階的に拡大する</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <h4 className="font-semibold text-yellow-800 mb-2">失敗例：検証を先延ばし</h4>
                            <p className="text-yellow-700 text-sm mb-3">「プロダクトが完成してから検証する」と考えてしまう</p>
                            <div className="bg-yellow-100 rounded p-2">
                              <p className="text-yellow-800 text-xs"><strong>対策：</strong>作る前に検証。プロトタイプやMVPで早期に学習する</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* 始めるボタン */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/canvas-list')}
            className="px-12 py-4 bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
          >
            リーンキャンバスを作ってみる
          </button>
          <p className="text-gray-600 mt-4">
            学んだ知識を活かして、あなたのビジネスアイデアをキャンバスに落とし込んでみましょう
          </p>
        </div>

      </main>
    </div>
  )
}