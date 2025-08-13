/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/projects/:path*',
        destination: 'http://localhost:8000/projects/:path*',
      },
    ]
  },
}

module.exports = nextConfig