import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/software-development-company',
        destination: '/website-development',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
