import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["pdfkit", "imapflow", "nodemailer"],
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
      {
        protocol: "https",
        hostname: "peptideosdobrasil.com.br",
      },
      {
        protocol: "https",
        hostname: "www.karytirze.fit",
      },
      {
        protocol: "https",
        hostname: "drogariasp.vteximg.com.br",
      },
      {
        protocol: "https",
        hostname: "alluviretatrutide40mg.uk",
      },
      {
        protocol: "https",
        hostname: "precosnoparaguai.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "singularmedicamentos.fbitsstatic.net",
      },
      {
        protocol: "https",
        hostname: "derma-solution.com",
      },
      {
        protocol: "https",
        hostname: "www.ibeautymachine.com",
      },
      {
        protocol: "https",
        hostname: "isradermbr.com",
      },
      {
        protocol: "https",
        hostname: "admin.korupharma.com",
      },
      {
        protocol: "https",
        hostname: "solvemedics.com",
      },
      {
        protocol: "https",
        hostname: "royal-peptides.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
