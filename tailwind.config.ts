import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "1.5rem",
            screens: {
                "2xl": "1360px",
            },
        },
        extend: {
            colors: {
                // پالت رنگی اختصاصی اسپاتیفای
                spotify: {
                    DEFAULT: "#1DB954", // رنگ اصلی اسپاتیفای
                    light: "#1ED760",
                    dark: "#1AA34A",
                },
                // پالت رنگی اختصاصی VPN (آبی متمایل به بنفش برای حس سرعت و پرمیوم بودن)
                vpn: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6", // رنگ اصلی VPN
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },
                // رنگ‌های پایه فروشگاه (تاریک و مدرن)
                store: {
                    dark: "#0f172a", // پس‌زمینه اصلی سایت
                    panel: "#1e293b", // پس‌زمینه کارت‌های محصول و فرم‌ها
                    border: "#334155",
                    success: "#10b981", // برای پیام‌های موفقیت‌آمیز (مثل ثبت سفارش)
                    warning: "#f59e0b",
                    danger: "#ef4444",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
            },
            fontFamily: {
                vazir: ["var(--font-vazirmatn)", "sans-serif"],
                iransans: ["IRANSans", "sans-serif"], 
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "float": { // انیمیشن شناور برای کارت‌های محصول
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "float": "float 3s ease-in-out infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        function ({ addUtilities }: any) {
            addUtilities({
                // مخفی کردن اسکرول‌بار برای لیست‌های فرم و جداول
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": { display: "none" },
                },
                // افکت درخشش برای متمایز کردن پکیج‌های اسپاتیفای
                ".box-glow-spotify": {
                    boxShadow: '0 0 20px rgba(29, 185, 84, 0.15), inset 0 0 10px rgba(29, 185, 84, 0.05)',
                },
                // افکت درخشش برای متمایز کردن پکیج‌های VPN
                ".box-glow-vpn": {
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.15), inset 0 0 10px rgba(59, 130, 246, 0.05)',
                }
            });
        },
    ],
};

export default config;
