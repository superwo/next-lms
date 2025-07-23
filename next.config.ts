import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "next-lms-radu.fly.storage.tigris.dev",
                port: "",
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
