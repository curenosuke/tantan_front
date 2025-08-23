// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:8000/api/:path*',
//       },
//       {
//         source: '/projects/:path*',
//         destination: 'http://localhost:8000/projects/:path*',
//       },
//     ]
//   },
// }

// module.exports = nextConfig


// デプロイする場合はこちら
require('dotenv').config()
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ビルド時のESLintチェックを無効化（25.08.23_18:06）
  eslint: {
    // ビルド時のESLintチェックを無効化
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時のTypeScriptチェックを無効化
    ignoreBuildErrors: true,
  },
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  },
}
module.exports = nextConfig