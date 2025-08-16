export interface InterviewToCanvasResponse {
  success: boolean
  current_canvas?: any
  proposed_canvas?: any
  message?: string
}

export default async function fetchInterviewToCanvas(
  projectId: number,
  noteId: number
): Promise<InterviewToCanvasResponse> {
  try {
    const res = await fetch(`/projects/${projectId}/interview-to-canvas`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note_id: noteId }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, message: err.message || 'APIエラー' }
    }
    return await res.json()
  } catch (e: any) {
    return { success: false, message: e.message || 'ネットワークエラー' }
  }
}
