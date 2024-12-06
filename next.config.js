// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', // Match the root path
          destination: '/wallets', // Redirect to your entry route
          permanent: true, // Indicates a 308 permanent redirect
        },
      ];
    },
    reactStrictMode: true, // Optional: Enables React's Strict Mode for better development experience
    swcMinify: true, // Optional: Enables SWC-based minification for faster builds
  };
  
  module.exports = nextConfig;
  