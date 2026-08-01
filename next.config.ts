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
  // Ensure Next.js does not expose env vars prefixed without NEXT_PUBLIC_
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
};

export default nextConfig;
