/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // async rewrites() {
    //     return [
    //       {
    //         source: 'perp-api/:path*',
    //         destination: `http://31.220.77.86:3201/:path*`,
    //       },
    //     ]
    //   },
};

export default nextConfig;
