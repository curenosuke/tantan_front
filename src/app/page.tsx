import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#FFBB3F] via-orange-500 to-[#FF8C00] bg-clip-text text-transparent">
            InnoQuest
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">by tantan</p>
        </div>
        <p className="mt-4 text-center text-lg text-gray-700 font-medium">
          新規事業開発のアイデア精緻化をサポート
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          <div className="space-y-4">
            <Link
              href="/signup"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FFBB3F] to-orange-500 hover:from-orange-500 hover:to-[#FFBB3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBB3F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
            >
              新規登録
            </Link>
            
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#FFBB3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBB3F] transition-all duration-300"
            >
              ログイン
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              主な機能
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center justify-center space-x-2">
                <span className="text-[#FFBB3F]">✓</span>
                <span>生成AIとの壁打ち機能</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="text-[#FFBB3F]">✓</span>
                <span>リーンキャンバスの作成・更新</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="text-[#FFBB3F]">✓</span>
                <span>インタラクティブな事業企画支援</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
