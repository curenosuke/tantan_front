/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/projects',
        destination: 'http://localhost:8000/projects',
      },
    ]
  },
}

module.exports = nextConfig