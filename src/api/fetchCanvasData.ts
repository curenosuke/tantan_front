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

const fetchCanvasData = async (projectId: string): Promise<LeanCanvas | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/latest`, {
      credentials: 'include',
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // データがnullまたはundefinedの場合の安全なチェック
      if (!data) {
        return null
      }
      
      // バックエンドのデータ構造に基づいてLean Canvasデータを構築
      if (data && typeof data === 'object' && data !== null) {
        // edit_idをキーとして持つオブジェクトから最初のデータを取得
        const keys = Object.keys(data)
        if (keys.length === 0) {
          return null
        }
        const editId = keys[0]
        const canvasDetails = data[editId]
        
        if (canvasDetails && typeof canvasDetails === 'object') {
          // /first-checkページのJSON挿入方法を参考にしてLean Canvasデータを構築
          // fetchItemで送信されるデータ構造と一致するようにフィールド名を調整
          const leanCanvasData: LeanCanvas = {
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
          
          return leanCanvasData
        }
      }
      
      // データが期待される形式でない場合はnullを返す
      return null
      
    } else {
      return null
    }
  } catch (error) {
    console.error('バックエンドからのデータ取得に失敗しました:', error)
    // エラー時はnullを返す
    return null
  }
}

export default fetchCanvasData
