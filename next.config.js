/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    overlay: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tayyab-web-bucket.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Add error handling for development
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          swiper: {
            name: "swiper",
            chunks: "all",
            test: /[\\/]node_modules[\\/](swiper|swiper-react)[\\/]/,
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
