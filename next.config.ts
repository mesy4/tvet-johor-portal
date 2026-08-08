import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
  // Allow Cloudflare Tunnel domains for dev
  allowedDevOrigins: ["*.trycloudflare.com"],
  // External packages that should not be bundled (Next.js 15)
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
