// ローカルの場合はこちら

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:8000/api/:path*',
//       },
//     ];
//   },
// };

// export default nextConfig;


// デプロイする場合はこちら
require('dotenv').config()
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  },
}
module.exports = nextConfig