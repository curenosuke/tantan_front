interface CanvasAutogenerateRequest {
  idea: string
}

interface CanvasAutogenerateResponse {
  idea_name?: string
  Problem?: string
  Customer_Segments?: string
  Unique_Value_Proposition?: string
  Solution?: string
  Channels?: string
  Revenue_Streams?: string
  Cost_Structure?: string
  Key_Metrics?: string
  Unfair_Advantage?: string
  Early_Adopters?: string
  Existing_Alternatives?: string
}

export default async function fetchCanvasAutogenerate(
  idea: string
): Promise<CanvasAutogenerateResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/canvas-autogenerate`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea_draft: idea
      })
    })
    
    if (response.ok) {
      const data: CanvasAutogenerateResponse = await response.json()
      console.log('キャンバス自動生成APIからのレスポンス:', data)
      return data
    } else {
      console.error('キャンバス自動生成APIからのレスポンスが正常ではありません:', response.status)
      return null
    }
  } catch (error) {
    console.error('キャンバス自動生成APIの呼び出しに失敗しました:', error)
    return null
  }
}

export type { CanvasAutogenerateRequest, CanvasAutogenerateResponse }
