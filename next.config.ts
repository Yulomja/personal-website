import type { NextConfig } from 'next';
import { basePath } from './lib/paths';
const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  agentRules: false,
  devIndicators: false,
  experimental: { globalNotFound: true },
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default nextConfig;
