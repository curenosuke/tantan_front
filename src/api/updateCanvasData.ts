interface CanvasUpdateRequest {
  project_id: number
  user_id: number
  update_comment: string
  field: Record<string, string>
}

interface CanvasUpdateResponse {
  success: boolean
  message?: string
}

export default async function updateCanvasData(
  projectId: number,
  userId: number,
  updateComment: string,
  field: Record<string, string>,
  updateCategory: string = 'manual' // デフォルト値
): Promise<CanvasUpdateResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/latest`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        user_id: userId,
        update_comment: updateComment,
        update_category: updateCategory, // ここでトップレベルで送る
        field: field
      })
    })
    
    if (response.ok) {
      const data: CanvasUpdateResponse = await response.json()
      console.log('キャンバス更新APIからのレスポンス:', data)
      return data
    } else {
      console.error('キャンバス更新APIからのレスポンスが正常ではありません:', response.status)
      const errorText = await response.text()
      console.error('エラー詳細:', errorText)
      return {
        success: false,
        message: `更新に失敗しました: ${response.status}`
      }
    }
  } catch (error) {
    console.error('キャンバス更新APIの呼び出しに失敗しました:', error)
    return {
      success: false,
      message: 'ネットワークエラーが発生しました'
    }
  }
}

export type { CanvasUpdateRequest, CanvasUpdateResponse }
