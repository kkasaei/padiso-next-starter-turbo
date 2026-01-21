import { withContentCollections } from '@content-collections/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  // Increase timeout for server actions (especially project creation with AI generation)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '**',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/s2/favicons**',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'drive-thirdparty.googleusercontent.com',
        port: '',
        pathname: '**',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'cdn.searchfit.ai',
        port: '',
        pathname: '**',
        search: ''
      }
    ]
  },
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@workspace/ui", "@workspace/db"],
}

export default withContentCollections(nextConfig);
