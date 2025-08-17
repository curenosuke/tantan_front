'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface CanvasVersion {
  version: string
  updated_at: string
  updated_by: string
  reason: 'direct_edit' | 'interview_reflection' | 'logic_check' | 'research_reflection'
  reason_description: string
  changes_summary: string
}

// ユーザー名取得用API
const fetchUserName = async (userId: number): Promise<string> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
      credentials: 'include',
    })
    if (!res.ok) return '不明';
    const data = await res.json();
    return data.email || '不明';
  } catch {
    return '不明';
  }
};

// バックエンドのupdate_categoryをフロント用ラベルに変換
const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case 'manual': return '直接編集';
    case 'interview': return 'インタビュー反映';
    case 'consistency_check': return '論理チェック';
    case 'research': return 'リサーチ反映';
    default: return 'その他';
  }
};

// update_categoryを日本語ラベルに変換
const getReasonLabel = (reason: string) => {
  switch (reason) {
    case 'manual':
      return '直接編集';
    case 'consistency_check':
      return '論理チェック';
    case 'research':
      return 'リサーチ反映';
    case 'interview':
      return 'インタビュー反映';
    case 'rollback':
      return 'バージョンロールバック';
    default:
      return 'その他';
  }
};

// update_categoryごとにアイコンを返す
const getReasonIcon = (reason: string) => {
  switch (reason) {
    case 'manual':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'interview':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'consistency_check':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'research':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'rollback':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4 4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-2a8 8 0 00-8-8H5" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export default function HistoryPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [versions, setVersions] = useState<CanvasVersion[]>([])
  const [v1User, setV1User] = useState<{ name: string; date: string } | null>(null);

  // ダミーデータ（バックエンド未接続時のデザイン確認用）
  const dummyVersions: CanvasVersion[] = [
    {
      version: "version4",
      updated_at: "2024-01-15T16:45:00Z",
      updated_by: "のーち",
      reason: "interview_reflection",
      reason_description: "農家Aさんへのインタビュー結果を反映",
      changes_summary: "顧客課題に若手農家の技術習得時間の長期化と水管理の自動化ニーズを追加。顧客セグメントをより具体的に定義。主要指標に成果指標を追加。"
    },
    {
      version: "version3",
      updated_at: "2024-01-14T14:30:00Z",
      updated_by: "かっさあ",
      reason: "logic_check",
      reason_description: "論理チェックの結果を反映",
      changes_summary: "独自の価値提案をより具体的に記述。圧倒的優位性に農業従事者との深い関係性を追加。販路に段階的導入プランを追加。"
    },
    {
      version: "version2",
      updated_at: "2024-01-13T10:15:00Z",
      updated_by: "のな",
      reason: "direct_edit",
      reason_description: "直接編集",
      changes_summary: "初回のリーンキャンバス作成。基本的な9つの要素を定義。"
    }
  ]

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // 認証チェック
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include' });
        if (!userRes.ok) {
          window.location.href = '/login';
          return;
        }
        const userData = await userRes.json();
        setUser(userData);

        // 履歴取得
        const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/history-list`, { credentials: 'include' });
        if (!historyRes.ok) {
          setVersions([]);
          setLoading(false);
          return;
        }
        const historyList = await historyRes.json();
        // ユーザー名を取得してマッピング
        const userIdSet = Array.from(new Set(historyList.map((h: any) => h.user_id))) as number[];
        const userMap: Record<number, string> = {};
        await Promise.all(userIdSet.map(async (uid) => {
          userMap[uid] = await fetchUserName(uid);
        }));
        // 整形
        const formatted = historyList.map((h: any, idx: number) => ({
          version: `version${h.version}`,
          updated_at: h.last_updated,
          updated_by: userMap[h.user_id] || '不明',
          reason: h.update_category,
          reason_description: getReasonLabel(h.update_category),
          changes_summary: h.update_comment || '',
          user_id: h.user_id,
        })).reverse(); // 新しい順に
        setVersions(formatted);
        // version1用の作成者名も取得
        if (historyList.length > 0) {
          const v1 = historyList.find((h: any) => h.version === 1);
          if (v1) {
            setV1User({
              name: userMap[v1.user_id] || '不明',
              date: v1.last_updated,
            });
          }
        }
      } catch (err) {
        setVersions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [projectId]);

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'manual':
        return 'bg-blue-500'; // 直接編集: 青
      case 'interview':
        return 'bg-green-500'; // インタビュー反映: 緑
      case 'consistency_check':
        return 'bg-purple-500'; // 論理チェック: 紫
      case 'research':
        return 'bg-orange-500'; // リサーチ反映: オレンジ
      case 'rollback':
        return 'bg-yellow-400'; // バージョンロールバック: イエロー
      default:
        return 'bg-gray-500'; // その他: グレー
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewVersion = (version: string) => {
    // バックエンド実装時は、指定されたバージョンのキャンバスを表示
    console.log(`Viewing version: ${version}`)
    // 実際の実装では、指定されたバージョンのキャンバスを表示するページに遷移
    router.push(`/canvas/${projectId}/version/${version}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-700 font-medium">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      
      <div className="flex">
        {/* サイドバー */}
        <Sidebar projectId={projectId} />
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー部分 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ブラッシュアップヒストリー</h1>
              <p className="text-gray-600">リーンキャンバスの更新履歴を確認できます</p>
            </div>

            {/* タイムライン */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-[#FFBB3F] text-white p-3 rounded-full mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">更新履歴</h2>
                  <p className="text-gray-600">最新のバージョンから過去の履歴を表示しています</p>
                </div>
              </div>

              <div className="relative">
                {/* タイムラインの縦線 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* バージョン履歴 */}
                <div className="space-y-8">
                  {versions.map((version, index) => (
                    <div key={version.version} className="relative">
                      {/* タイムラインの丸いポイント */}
                      <div className="absolute left-4 top-4 w-4 h-4 bg-[#FFBB3F] rounded-full border-4 border-white shadow-md"></div>

                      {/* バージョン情報 */}
                      <div className="ml-12 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#FFBB3F]/10 text-[#FFBB3F] border border-[#FFBB3F]/20">
                              {version.version}
                            </span>
                            <span className="text-sm text-gray-600">
                              更新者: {version.updated_by}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(version.updated_at)}
                          </span>
                        </div>

                        {/* カテゴリー見出し＋アイコン */}
                        <div className="flex items-center mb-3">
                          <div className={`${getReasonColor(version.reason)} text-white p-2 rounded-full mr-3`}>
                            {getReasonIcon(version.reason)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {getReasonLabel(version.reason)}
                          </span>
                        </div>
                        {/* コメント（update_comment） */}
                        <p className="text-sm text-gray-600 mb-2">
                          {version.changes_summary}
                        </p>
                        {/* このバージョンを参照ボタン */}
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleViewVersion(version.version)}
                            className="inline-flex items-center bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            このバージョンを参照
                          </button>
                        </div>
                      </div>

                      {/* 最初のバージョン以外に矢印を表示 */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 初期作成ポイント */}
                <div className="relative mt-8">
                  <div className="absolute left-4 top-4 w-4 h-4 bg-gray-400 rounded-full border-4 border-white shadow-md"></div>
                  <div className="ml-12 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          version1
                        </span>
                        <span className="text-sm text-gray-600">
                          作成者: {v1User ? v1User.name : '不明'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {v1User ? formatDate(v1User.date) : ''}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-500 text-white p-2 rounded-full mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        プロジェクト作成
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        リーンキャンバスの初期作成
                      </span>
                    </div>
                    {/* このバージョンを参照ボタン */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewVersion('version1')}
                        className="inline-flex items-center bg-gradient-to-r from-[#FFBB3F] to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        このバージョンを参照
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 凡例 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">更新理由の凡例</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">直接編集</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">インタビュー反映</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">論理チェック</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">リサーチ反映</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-400 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-4-4 4-4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-2a8 8 0 00-8-8H5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">バージョンロールバック</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 