import type {NextConfig} from 'next';

const repo = 'studio';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: `/${repo}/`,
  basePath: `/${repo}`,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
