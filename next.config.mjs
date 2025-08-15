/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
    unoptimized: true, // for Next Image component on static sites
  },
  basePath: '/health_app_survey',
  assetPrefix: '/health_app_survey/',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
