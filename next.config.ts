import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repo = 'studio';
const assetPrefix = isProd ? `/${repo}/` : undefined;
const basePath = isProd ? `/${repo}` : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
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
