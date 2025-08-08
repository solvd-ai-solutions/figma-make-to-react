/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep unoptimized to avoid remote config; Vercel will still serve images
    unoptimized: true,
  },
}

module.exports = nextConfig

