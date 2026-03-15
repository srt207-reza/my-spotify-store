import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            // دامنه جدید برای تصاویر محصولات سالونا اضافه شد
            {
                protocol: "https",
                hostname: "map.mysalona.ir",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
