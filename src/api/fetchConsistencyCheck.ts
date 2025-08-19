interface ConsistencyCheckResponse {
  success: boolean
  analysis: {
    Q1: {
      question: string
      perspective: string
    }
    Q2: {
      question: string
      perspective: string
    }
    Q3: {
      question: string
      perspective: string
    }
    Q4: {
      question: string
      perspective: string
    }
    Q5: {
      question: string
      perspective: string
    }
  } | null
  analyzed_at: string | null
}

const fetchConsistencyCheck = async (projectId: string): Promise<ConsistencyCheckResponse | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/consistency-check`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data: ConsistencyCheckResponse = await response.json()
      console.log('整合性確認APIからのレスポンス:', data)
      return data
    } else {
      console.error('整合性確認APIからのレスポンスが正常ではありません:', response.status)
      return null
    }
  } catch (error) {
    console.error('整合性確認APIの呼び出しに失敗しました:', error)
    return null
  }
}

export default fetchConsistencyCheck
export type { ConsistencyCheckResponse }
