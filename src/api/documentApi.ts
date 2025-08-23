// ドキュメント管理関連のAPI関数

interface DocumentUploadResult {
  message: string
  document_id: number
  file_info: {
    original_filename: string
    file_type: string
    file_size: number
  }
  text_length: number
  text_preview: string
  rag_processing: {
    success: boolean
    message: string
  }
}

interface Document {
  document_id: number
  user_email: string;
  project_id: number
  file_name: string
  file_type: string
  file_size: number
  source_type: string
  uploaded_at: string
}

// 日本語ラベルをバックエンドのEnum値に変換する関数
const convertSourceTypeToBackend = (sourceType: string): string => {
  const mapping: Record<string, string> = {
    '自社情報': 'company',
    '市場情報': 'customer', // 市場情報を顧客情報として扱う
    '競合情報': 'competitor',
    'マクロトレンド': 'macrotrend'
  }
  return mapping[sourceType] || 'company'
}

// バックエンドのEnum値を日本語ラベルに変換する関数
const convertSourceTypeToFrontend = (sourceType: string): string => {
  const mapping: Record<string, string> = {
    'company': '自社情報',
    'customer': '市場情報',
    'competitor': '競合情報',
    'macrotrend': 'マクロトレンド'
  }
  return mapping[sourceType] || '自社情報'
}

/**
 * ファイルをアップロードして処理する
 */
export const uploadDocument = async (
  projectId: number,
  file: File,
  sourceType: string
): Promise<DocumentUploadResult> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('source_type', convertSourceTypeToBackend(sourceType))
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/projects/${projectId}/upload-and-process`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  )
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'アップロードに失敗しました' }))
    throw new Error(errorData.detail || 'アップロードに失敗しました')
  }
  
  return response.json()
}

/**
 * プロジェクトのドキュメント一覧を取得する
 */
export const fetchDocuments = async (projectId: number): Promise<Document[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/projects/${projectId}/documents`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'ドキュメント一覧の取得に失敗しました' }))
    throw new Error(errorData.detail || 'ドキュメント一覧の取得に失敗しました')
  }
  
  return response.json()
}

/**
 * ドキュメントを削除する
 */
export const deleteDocument = async (projectId: number, documentId: number): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/projects/${projectId}/documents/${documentId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'ドキュメントの削除に失敗しました' }))
    throw new Error(errorData.detail || 'ドキュメントの削除に失敗しました')
  }
}