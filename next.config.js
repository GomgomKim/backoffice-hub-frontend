/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // API 프록시 설정
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKOFFICE_API_URL || "http://localhost:5000"}/api/v1/:path*`,
      },
    ];
  },

  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
