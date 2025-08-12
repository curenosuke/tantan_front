interface AutoAnswerGenerationRequest {
  project_id: number
  questions: Array<{
    question: string
    perspective: string
  }>
}

interface AutoAnswerGenerationResponse {
  success: boolean
  answers: string[] | null
  generated_at: string | null
}

export default async function fetchAutoAnswer(
  projectId: number,
  questions: Array<{ question: string; perspective: string }>
): Promise<AutoAnswerGenerationResponse | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}/auto-answer`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        questions: questions
      })
    })
    
    if (response.ok) {
      const data: AutoAnswerGenerationResponse = await response.json()
      console.log('AI回答自動生成APIからのレスポンス:', data)
      return data
    } else {
      console.error('AI回答自動生成APIからのレスポンスが正常ではありません:', response.status)
      return null
    }
  } catch (error) {
    console.error('AI回答自動生成APIの呼び出しに失敗しました:', error)
    return null
  }
}

export type { AutoAnswerGenerationRequest, AutoAnswerGenerationResponse }
