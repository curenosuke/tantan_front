'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import fetchCanvasData from '@/api/fetchCanvasData'

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
  const [isDownloading, setIsDownloading] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

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

  const handleDownloadPDF = async () => {
    if (!canvasRef.current || !canvasData) return
    
    setIsDownloading(true)
    
    // 画面のちらつきを防ぐため、一時的にローディングオーバーレイを表示
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    overlay.style.zIndex = '9999'
    overlay.style.display = 'flex'
    overlay.style.alignItems = 'center'
    overlay.style.justifyContent = 'center'
    overlay.innerHTML = `
      <div style="text-align: center; font-family: system-ui, sans-serif;">
        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #FFBB3F; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <p style="margin: 0; color: #374151; font-weight: 500;">PDF生成中...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    document.body.appendChild(overlay)
    
    try {
      // モダンカラー関数を修正する関数
      const fixModernColors = (element: HTMLElement) => {
        const allElements = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[]
        const modernColorFunctions = ['oklch', 'oklab', 'lch', 'lab', 'color']
        
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el)
          
          // 背景色の修正
          if (computedStyle.backgroundColor && modernColorFunctions.some(fn => computedStyle.backgroundColor.includes(fn))) {
            el.style.backgroundColor = '#ffffff'
          }
          
          // テキスト色の修正
          if (computedStyle.color && modernColorFunctions.some(fn => computedStyle.color.includes(fn))) {
            el.style.color = '#000000'
          }
          
          // ボーダー色の修正
          if (computedStyle.borderColor && modernColorFunctions.some(fn => computedStyle.borderColor.includes(fn))) {
            el.style.borderColor = '#e5e7eb'
          }
          
          // その他のカラープロパティの修正
          const colorProperties = ['outlineColor', 'textDecorationColor', 'caretColor', 'accentColor']
          colorProperties.forEach(prop => {
            const value = computedStyle.getPropertyValue(prop)
            if (value && modernColorFunctions.some(fn => value.includes(fn))) {
              el.style.setProperty(prop, '#000000')
            }
          })
        })
      }
      
      // 元の要素をクローンして画面外で処理
      const clonedElement = canvasRef.current.cloneNode(true) as HTMLElement
      
      // 一時的なコンテナを作成（不可視だが画面内）
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'fixed'
      tempContainer.style.left = '0'
      tempContainer.style.top = '0'
      tempContainer.style.width = '1200px'
      tempContainer.style.height = 'auto'
      tempContainer.style.opacity = '0'
      tempContainer.style.pointerEvents = 'none'
      tempContainer.style.zIndex = '-1000'
      tempContainer.style.overflow = 'visible'
      
      document.body.appendChild(tempContainer)
      tempContainer.appendChild(clonedElement)
      
      clonedElement.style.width = '1200px'
      clonedElement.style.height = 'auto'
      clonedElement.style.overflow = 'visible'
      clonedElement.style.display = 'block'
      
      // モダンカラーを修正
      fixModernColors(clonedElement)
      
      // 既存のCSSスタイルをコピー
      const existingStyles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')
          } catch (e) {
            return ''
          }
        })
        .join('\n')
      
      // PDF用のスタイル調整
      const styleElement = document.createElement('style')
      styleElement.textContent = existingStyles + `
        /* グレーの背景を削除 */
        * {
          outline-color: transparent !important;
          text-decoration-color: currentColor !important;
          caret-color: black !important;
          accent-color: #FFBB3F !important;
        }
        
        /* PDF用のレイアウト調整 */
        .grid-cols-10 {
          display: grid !important;
          grid-template-columns: repeat(10, 1fr) !important;
          gap: 8px !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
        }
        
        /* 各セルのサイズ調整 */
        .col-span-2 {
          grid-column: span 2 !important;
          min-height: 150px !important;
          max-height: 200px !important;
        }
        
        .row-span-2 {
          grid-row: span 2 !important;
          min-height: 320px !important;
        }
        
        .col-span-5 {
          grid-column: span 5 !important;
          min-height: 120px !important;
        }
        
        /* グラデーション背景を柔らかいオレンジに */
        .bg-gradient-to-r, [class*="bg-gradient"] {
          background:rgb(252, 126, 24) !important; /* より柔らかいオレンジ */
          background-image: none !important;
        }
        
        /* 具体的なカラー指定 */
        .text-orange-700 { color: #c2410c !important; }
        .bg-orange-50, [class*="orange-50"] { background-color: #fff7ed !important; }
        .border-orange-500, [class*="orange-500"] { border-color: #f97316 !important; }
        .text-gray-900 { color: #111827 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-white { color: #ffffff !important; }
        .bg-white { background-color: #ffffff !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-gray-300 { border-color: #d1d5db !important; }
        
        /* 余計なグレー背景を削除 */
        .bg-gray-50, .bg-gray-100, [class*="gray-50"], [class*="gray-100"] { 
          background-color: #ffffff !important; 
        }
        
        /* 全体のコンテナ調整 */
        .bg-white.rounded-xl {
          padding: 16px !important;
          margin: 0 !important;
          box-shadow: none !important;
          border: 1px solid #e5e7eb !important;
        }
        
        /* テキストサイズの調整 */
        .text-xs {
          font-size: 10px !important;
          line-height: 1.3 !important;
        }
        
        /* アイデア名ヘッダーの調整 */
        .flex.items-center {
          margin-bottom: 12px !important;
          height: 48px !important; /* 固定高さでそろえる */
        }
        
        /* アイデア名のボックス高さ調整 */
        .flex.items-center > div {
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* ヘッダータイトルの調整 - 柔らかいオレンジ背景 */
        .bg-gradient-to-r.from-\\[\\#FFBB3F\\], 
        [class*="from-\\[\\#FFBB3F\\]"],
        [class*="bg-gradient-to-r"] {
          background:rgb(255, 170, 100) !important; /* 柔らかいオレンジ */
          background-image: none !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          color: #ffffff !important;
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* 各セルのヘッダー（見出し）を上下中央に */
        .bg-gradient-to-r.from-\\[\\#FFBB3F\\]\\/30,
        [class*="orange-50"] {
          background-color:rgb(248, 165, 69) !important; /* 柔らかいオレンジ背景 */
          border-color:rgb(248, 166, 99) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          min-height: 40px !important;
        }
      `
      clonedElement.appendChild(styleElement)
      
      // グラデーション背景とモダンカラーを単色に置き換え
      const gradientElements = clonedElement.querySelectorAll('[class*="bg-gradient"]')
      gradientElements.forEach((el) => {
        const element = el as HTMLElement
        element.style.background = '#FB923C !important' // 柔らかいオレンジ
        element.style.backgroundImage = 'none !important'
        element.style.color = '#ffffff !important' // 白文字を確実に
        element.style.height = '48px'
        element.style.display = 'flex'
        element.style.alignItems = 'center'
        element.style.justifyContent = 'center'
        element.classList.remove(...Array.from(element.classList).filter(cls => cls.includes('gradient')))
      })
      
      // 各セルの見出し部分を上下中央揃えに
      const cellHeaders = clonedElement.querySelectorAll('.py-2, [class*="orange-50"]')
      cellHeaders.forEach((el) => {
        const element = el as HTMLElement
        element.style.display = 'flex'
        element.style.alignItems = 'center'
        element.style.justifyContent = 'center'
        element.style.backgroundColor = '#FED7AA' // 柔らかいオレンジ背景
        element.style.borderColor = '#FB923C'
        element.style.minHeight = '40px'
      })
      
      // TailwindのカラークラスをHTML2Canvas対応の色に置き換え
      const colorMap: { [key: string]: string } = {
        'text-orange-700': '#c2410c',
        'bg-orange-50': '#FED7AA', // 柔らかいオレンジに変更
        'border-orange-500': '#FB923C', // 柔らかいオレンジに変更
        'text-gray-900': '#111827',
        'text-gray-700': '#374151',
        'text-gray-600': '#4b5563',
        'bg-gray-50': '#f9fafb',
        'bg-gray-100': '#f3f4f6',
        'border-gray-200': '#e5e7eb',
        'border-gray-300': '#d1d5db'
      }
      
      Object.entries(colorMap).forEach(([className, color]) => {
        const elements = clonedElement.querySelectorAll(`.${className}`)
        elements.forEach((el) => {
          const element = el as HTMLElement
          if (className.startsWith('text-')) {
            element.style.color = color + ' !important'
          } else if (className.startsWith('bg-')) {
            element.style.backgroundColor = color + ' !important'
          } else if (className.startsWith('border-')) {
            element.style.borderColor = color + ' !important'
          }
        })
      })
      
      // スタイル適用後のレンダリングを待つ
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // デバッグ: 要素の状態を確認
      console.log('クローン要素のサイズ:', {
        width: clonedElement.offsetWidth,
        height: clonedElement.offsetHeight,
        scrollWidth: clonedElement.scrollWidth,
        scrollHeight: clonedElement.scrollHeight
      })
      console.log('クローン要素の内容:', clonedElement.innerHTML.substring(0, 200))
      
      // キャンバス要素をキャプチャ
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // 高解像度で出力
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true, // ログを有効化してデバッグ
        width: clonedElement.scrollWidth || 1200, // 要素の実際の幅を使用
        height: clonedElement.scrollHeight || 600, // 要素の実際の高さを使用
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // クローンしたドキュメント内でもモダンカラーを修正
          const modernColorFunctions = ['oklch', 'oklab', 'lch', 'lab', 'color']
          const allElements = clonedDoc.querySelectorAll('*') as NodeListOf<HTMLElement>
          
          allElements.forEach((el) => {
            const style = el.style
            
            // 全てのCSSプロパティをチェック
            for (let i = 0; i < style.length; i++) {
              const prop = style[i]
              const value = style.getPropertyValue(prop)
              
              if (value && modernColorFunctions.some(fn => value.includes(fn))) {
                if (prop.includes('background') || prop.includes('Background')) {
                  style.setProperty(prop, '#ffffff', 'important')
                } else if (prop.includes('color') || prop.includes('Color')) {
                  if (prop.includes('border') || prop.includes('Border')) {
                    style.setProperty(prop, '#e5e7eb', 'important')
                  } else {
                    style.setProperty(prop, '#000000', 'important')
                  }
                }
              }
            }
            
            // 特に問題になりやすいプロパティを強制的に設定
            const computedStyle = clonedDoc.defaultView?.getComputedStyle(el)
            if (computedStyle) {
              if (modernColorFunctions.some(fn => computedStyle.backgroundColor.includes(fn))) {
                style.setProperty('background-color', '#ffffff', 'important')
              }
              if (modernColorFunctions.some(fn => computedStyle.color.includes(fn))) {
                style.setProperty('color', '#000000', 'important')
              }
              if (modernColorFunctions.some(fn => computedStyle.borderColor.includes(fn))) {
                style.setProperty('border-color', '#e5e7eb', 'important')
              }
            }
          })
        }
      })
      
      // デバッグ: キャンバスの状態を確認
      console.log('生成されたキャンバス:', {
        width: canvas.width,
        height: canvas.height,
        dataURL: canvas.toDataURL('image/png').substring(0, 100)
      })
      
      // 一時コンテナを削除
      document.body.removeChild(tempContainer)
      
      // PDFを作成（A4サイズ、横向き）
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // 画像の比率を計算（余白を考慮）
      const margin = 10 // 10mmの余白
      const availableWidth = pdfWidth - (margin * 2)
      const availableHeight = pdfHeight - (margin * 2)
      
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)
      
      const imgDisplayWidth = imgWidth * ratio
      const imgDisplayHeight = imgHeight * ratio
      
      // 中央配置のためのオフセット計算
      const offsetX = margin + (availableWidth - imgDisplayWidth) / 2
      const offsetY = margin + (availableHeight - imgDisplayHeight) / 2
      
      // 画像をPDFに追加
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        offsetX,
        offsetY,
        imgDisplayWidth,
        imgDisplayHeight
      )
      
      // ファイル名を生成
      const fileName = `${canvasData.idea_name.replace(/[^\w\s-]/g, '').trim()}_lean_canvas.pdf`
      
      // PDFをダウンロード
      pdf.save(fileName)
      
    } catch (error) {
      console.error('PDF生成エラー:', error)
      alert('PDF生成中にエラーが発生しました。もう一度お試しください。')
    } finally {
      // オーバーレイを削除
      document.body.removeChild(overlay)
      setIsDownloading(false)
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
                disabled={isDownloading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isDownloading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white hover:scale-105 hover:shadow-lg shadow-md'
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    <span>PDF生成中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>キャンバスをダウンロード</span>
                  </>
                )}
              </button>
            </div>

            {/* リーンキャンバス */}
            <div ref={canvasRef} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
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