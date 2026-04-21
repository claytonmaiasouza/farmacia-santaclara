import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zphc-store.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "f.fcdn.app",
      },
      {
        protocol: "https",
        hostname: "landergold.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn-ilelbmd.nitrocdn.com",
      },
      {
        protocol: "https",
        hostname: "cooperpharma.com",
        pathname: "/images/products/**",
      },
      {
        protocol: "https",
        hostname: "purebiolabs.com",
      },
      {
        protocol: "https",
        hostname: "www.bacteriostaticwater.com",
      },
      {
        protocol: "https",
        hostname: "images.tcdn.com.br",
      },
      {
        protocol: "https",
        hostname: "rizochem.com",
      },
      {
        protocol: "https",
        hostname: "asteralabs.org",
      },
    ],
  },
};

export default nextConfig;
