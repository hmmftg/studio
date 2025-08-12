import type {NextConfig} from 'next';

const repo = 'studio';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: isProd ? `/${repo}/` : undefined,
  basePath: isProd ? `/${repo}` : undefined,
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
