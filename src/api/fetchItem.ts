export default async function fetchItem(canvasData: {
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
}) {
  try {
    console.log('fetchItem called with data:', canvasData)
    
    // まず現在のユーザー情報を取得
    console.log('Fetching current user info...')
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.status}`)
    }

    const userData = await userResponse.json()
    console.log('Current user data:', userData)

    if (!userData.user_id) {
      throw new Error('User ID not found. Please login first.')
    }
    
    // バックエンドが期待するデータ構造に変換
    const requestData = {
      user_id: userData.user_id,
      project_name: canvasData.idea_name,
      field: {
        problem: canvasData.problem,
        existing_alternatives: canvasData.existing_alternatives,
        solution: canvasData.solution,
        key_metrics: canvasData.key_metrics,
        unique_value_proposition: canvasData.unique_value_proposition,
        high_level_concept: canvasData.high_level_concept,
        unfair_advantage: canvasData.unfair_advantage,
        channels: canvasData.channels,
        customer_segments: canvasData.customer_segments,
        early_adopters: canvasData.early_adopters,
        cost_structure: canvasData.cost_structure,
        revenue_streams: canvasData.revenue_streams,
        idea_name: canvasData.idea_name
      }
    }

    console.log('Sending request to /projects with data:', requestData)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HTTP error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()
    console.log('Success response:', result)
    return result
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}
