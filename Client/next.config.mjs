/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // هذا السطر هو الأهم للموبايل
  images: { unoptimized: true },
  trailingSlash: true, // أضف هذا السطر لتحسين المسارات في الموبايل
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}


export default nextConfig
