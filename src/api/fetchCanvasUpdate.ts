interface CanvasUpdateRequest {
  project_id: number
  user_answers: Array<{
    question: string
    answer: string
    perspective: string
  }>
}

interface CanvasUpdateResponse {
  success: boolean
  updates: Array<{
    field: string
    before: string
    after: string
    reason: string
  }> | null
  updated_canvas: Record<string, string> | null
  generated_at: string | null
}

export default async function fetchCanvasUpdate(
  projectId: number,
  userAnswers: Array<{ question: string; answer: string; perspective: string }>
): Promise<CanvasUpdateResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/projects/${projectId}/canvas-update`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        user_answers: userAnswers
      })
    })
    
    if (response.ok) {
      const data: CanvasUpdateResponse = await response.json()
      console.log('リーンキャンバス更新案生成APIからのレスポンス:', data)
      return data
    } else {
      console.error('リーンキャンバス更新案生成APIからのレスポンスが正常ではありません:', response.status)
      // エラー時はダミーデータを返す
      return generateDummyCanvasUpdate()
    }
  } catch (error) {
    console.error('リーンキャンバス更新案生成APIの呼び出しに失敗しました:', error)
    // エラー時はダミーデータを返す
    return generateDummyCanvasUpdate()
  }
}

// ダミーデータ生成関数
function generateDummyCanvasUpdate(): CanvasUpdateResponse {
  return {
    success: true,
    updates: [
      {
        field: 'problem',
        before: '• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題',
        after: '• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化',
        reason: 'ユーザーの回答から、若手農家の技術習得に関する課題が追加されました。'
      },
      {
        field: 'customer_segments',
        before: '中小規模の農業従事者',
        after: 'デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）',
        reason: 'より具体的なターゲット像を定義することで、マーケティング戦略が明確になります。'
      },
      {
        field: 'key_metrics',
        before: '• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）',
        after: '• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）\n• 農作物の収穫量向上率\n• 農作業時間短縮率\n• 農家の収益性向上率',
        reason: '成果指標を追加することで、ビジネスインパクトをより適切に測定できます。'
      }
    ],
    updated_canvas: {
      problem: '• 高齢化と人手不足による収益性の低下\n• 高額で複雑なスマート農業機器の導入困難\n• 経験に依存した農業技術の継承問題\n• 若手農家の技術習得時間の長期化',
      existing_alternatives: '• ベテラン農家の長年の経験と勘（人依存、再現性なし、若手・新規農家が活用困難）\n• 安価なアナログ・デジタル機器による手動記録・管理（データ断片化、記録・分析が煩雑、リアルタイム性が低い）\n• 既存のスマート農業ソリューション（高価格、複雑な操作、導入ハードルが高い）',
      solution: '• 土壌・気象・植物画像をリアルタイム測定する小型センシングデバイス\n• 作物生育・水管理・病害予測を可視化するスマートフォンアプリ\n• クラウドでの自動データ蓄積とAI農業アドバイス\n• 低コスト・低消費電力設計、太陽光発電対応\n• 段階的導入プランとリースオプション提供',
      key_metrics: '• センサー導入台数\n• SaaS継続率（月間解約率）\n• アプリ利用率（日次・週次アクティブユーザー）\n• 農作物の収穫量向上率\n• 農作業時間短縮率\n• 農家の収益性向上率',
      unique_value_proposition: '使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。技術的優位性により、競合他社の半額以下での提供を実現。',
      high_level_concept: '使いやすいスマート農業ソリューション。センシングと精密機器技術を活用し、手頃な価格で高性能な環境センサーとスマートフォンアプリベースの農場管理ダッシュボードを統合ソリューションとして提供。',
      unfair_advantage: '• 独自の超小型・低消費電力センサー技術（例：MEMS、画像センサー）\n• プリンターヘッド技術を活用した農業散布機器との統合可能性\n• 国内製造による品質・信頼性、全国販売網構築可能性\n• スマートグラス・AR技術との将来統合（例：独自MOVARIOスマートグラス）\n• 農業従事者との深い関係性と理解',
      channels: '• 地域農協（JA）との協業販売\n• 全国農業機械販売ルート\n• 段階的導入プランとリースオプション',
      customer_segments: 'デジタル化に前向きな40-60代の中小規模農家（耕作面積5-20ha）',
      early_adopters: '日本国内の米・野菜農家で、デジタル化に前向きな40-60代の中小規模農家',
      cost_structure: '• センサー・ハードウェア開発・量産コスト\n• スマートフォンアプリ・クラウドプラットフォーム開発・運用\n• 顧客サポート・チャネル開発（営業・代理店）\n• 段階的導入支援コスト',
      revenue_streams: '• センサーデバイス販売（初期導入コスト）\n• 月額または年額SaaSダッシュボード利用料\n• リースオプションによる継続収益',
      idea_name: '精密農業向けスマート農業センシング&管理プラットフォーム'
    },
    generated_at: new Date().toISOString()
  }
}

export type { CanvasUpdateRequest, CanvasUpdateResponse }
