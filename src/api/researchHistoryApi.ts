// リサーチ履歴関連のAPI関数

interface ResearchHistory {
  research_id: number
  researched_at: string
  user_email: string
  edit_id?: number
  user_id?: number
  result_text?: string
}

/**
 * プロジェクトのリサーチ履歴を取得する
 */
export const fetchResearchHistory = async (projectId: number): Promise<ResearchHistory[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/projects/${projectId}/research-list`,
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