import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/updated_portfolio',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
