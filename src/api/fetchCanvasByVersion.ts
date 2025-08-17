interface LeanCanvas {
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
}

/**
 * 指定プロジェクト・バージョンのリーンキャンバスを取得
 */
const fetchCanvasByVersion = async (
  projectId: string | number,
  version: string | number
): Promise<LeanCanvas | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/${version}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    // バックエンドの返却形式（edit_id: { ...fields })から最初の値を抽出
    if (data && typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length > 0) {
        return data[keys[0]] as LeanCanvas;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

export default fetchCanvasByVersion;
export type { LeanCanvas };
