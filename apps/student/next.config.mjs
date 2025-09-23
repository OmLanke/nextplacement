/** @type {import('next').NextConfig} */
import path from 'path';

const __dirname = path.resolve();

const nextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/db'],
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  async rewrites() {
    return [
        {
            source: '/admin',
            destination: `${process.env.ADMIN_DOMAIN}/admin`,
        },
        {
            source: '/admin/:path+',
            destination: `${process.env.ADMIN_DOMAIN}/admin/:path+`,
        },
        {
            source: '/admin-static/:path+',
            destination: `${process.env.ADMIN_DOMAIN}/admin-static/:path+`,
        }
    ];
}
};

export default nextConfig;
