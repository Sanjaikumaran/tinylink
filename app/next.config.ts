/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  devIndicators: {
    buildActivity: false,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },

    disableDevTools: true,
  },
};

export default nextConfig;
