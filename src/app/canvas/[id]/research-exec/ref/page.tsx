'use client'
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface ResearchDetail {
  research_id: number;
  user_id: number;
  user_email: string;
  researched_at: string;
  result_text: string;
}

export default function ResearchRefPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.id as string;
  const researchId = searchParams.get('rid');

  const [user, setUser] = useState<{ user_id: number; email: string; created_at: string; last_login?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ResearchDetail | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // リサーチ一覧から該当IDを抽出
          if (researchId) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/research-list`, {
              credentials: 'include',
            });
            if (res.ok) {
              const list = await res.json();
              const found = list.find((item: ResearchDetail) => String(item.research_id) === String(researchId));
              setDetail(found || null);
            }
          }
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        // エラー時は何もしない
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, [projectId, researchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-700 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      <div className="flex min-h-screen">
        <Sidebar projectId={projectId} />
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">リサーチ詳細</h1>
            {detail ? (
              <div className="space-y-6">
                <div>
                  <span className="font-semibold text-gray-700">リサーチ実施者：</span>
                  <span>{detail.user_email} (ID: {detail.user_id})</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">リサーチ実施時刻：</span>
                  <span>{new Date(detail.researched_at).toLocaleString('ja-JP')}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">リサーチ結果：</span>
                  <pre className="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-line border border-gray-200 mt-2">{detail.result_text}</pre>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">リサーチ詳細が見つかりませんでした。</div>
            )}
            <div className="mt-8">
              <button
                onClick={() => router.push(`/canvas/${projectId}/research-exec`)}
                className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 hover:shadow-lg transition-all"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
