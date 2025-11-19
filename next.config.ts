import type { NextConfig } from "next";
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  turbopack: {}, // Silence Turbopack warning
  typescript: {
    ignoreBuildErrors: true,
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

export default pwaConfig(nextConfig);
