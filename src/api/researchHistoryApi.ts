// リサーチ履歴関連のAPI関数

interface ResearchHistory {
  research_id: number
  execution_datetime: string
  canvas_version: string
  executed_by: string
  created_at: string
}

/**
 * プロジェクトのリサーチ履歴を取得する
 */
export const fetchResearchHistory = async (projectId: number): Promise<ResearchHistory[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/research-history`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'リサーチ履歴の取得に失敗しました' }))
      throw new Error(errorData.detail || 'リサーチ履歴の取得に失敗しました')
    }
    
    return response.json()
  } catch (error) {
    console.error('リサーチ履歴取得エラー:', error)
    throw error
  }
}

export type { ResearchHistory }