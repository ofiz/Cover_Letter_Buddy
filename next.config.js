/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    MISTRAL_MODEL: process.env.MISTRAL_MODEL,
  },
}

module.exports = nextConfig