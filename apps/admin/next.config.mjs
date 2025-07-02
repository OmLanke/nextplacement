/** @type {import('next').NextConfig} */
import path from 'path';

const __dirname = path.resolve();

const nextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/db'],
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
