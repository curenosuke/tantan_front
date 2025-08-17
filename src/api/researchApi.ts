// リサーチ・RAG検索関連のAPI関数

interface ResearchResult {
  success: boolean
  research_result: string
  update_proposal: string
  canvas_data?: any
  structured_updates?: Array<{
    field: string
    field_japanese: string
    before: string
    after: string
    reason: string
  }>
}

interface SearchRequest {
  query: string
  limit?: number
}

interface SearchResult {
  document_id: number
  chunk_id: number
  content: string
  similarity_score: number
  file_name?: string
  source_type?: string
}

interface SearchResponse {
  query: string
  results_count: number
  results: SearchResult[]
}

/**
 * リサーチを実行する（RAG機能を使った市場調査・競合分析等）
 */
export const executeResearch = async (
  projectId: number
): Promise<ResearchResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/research`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'リサーチの実行に失敗しました' }))
    throw new Error(errorData.detail || 'リサーチの実行に失敗しました')
  }
  
  return response.json()
}

/**
 * RAGベクトル検索を実行する
 */
export const searchRelevantContent = async (
  projectId: number,
  query: string,
  limit: number = 5
): Promise<SearchResponse> => {
  const searchRequest: SearchRequest = {
    query,
    limit
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
      credentials: 'include',
    }
  )
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: '検索に失敗しました' }))
    throw new Error(errorData.detail || '検索に失敗しました')
  }
  
  return response.json()
}