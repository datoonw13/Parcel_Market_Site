/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  formats: ["image/png", "image/jpg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "64.23.229.149:4000",
        port: "",
        pathname: "",
      },
    ],
  },
};

export default nextConfig;
