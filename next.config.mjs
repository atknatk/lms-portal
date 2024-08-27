/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'platform-lookaside.fbsbx.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
          {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '1337',
            pathname: '/uploads/**',
          },
          {
            protocol: 'https',
            hostname: 'admin.abcenglishonline.com',
          },
          {
            protocol: 'https',
            hostname: 'atakan-lms.s3.eu-north-1.amazonaws.com',
          },
          {
            protocol: 'https',
            hostname: 'atakan-dev.s3.eu-north-1.amazonaws.com',
          },
          {
            protocol: 'https',
            hostname: 'img.youtube.com',
          },
          {
            protocol: 'https',
            hostname: 'scontent-arn2-1.xx.fbcdn.net', 
          }
        ],
      },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: process.env.ENV == 'development' ? `https://dash.abcenglishonline.com/api/:path*` : '/api/:path*',
          },
        ]
      },
};

export default nextConfig;
