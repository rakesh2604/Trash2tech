import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1'
  },
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/favicon.svg' }];
  },
};

// In development, skip PWA wrapper to avoid blank page / SW issues
export default isProd ? withPWA({ dest: 'public' })(config) : config;

