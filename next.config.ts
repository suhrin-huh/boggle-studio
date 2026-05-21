import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.6', '192.168.0.18'],
  /*body 제한 1MB(default) -> 10MB로 변경 */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 제한을 10MB로 상향 (기본값: 1MB)
    },
  },
};

export default nextConfig;
