"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Globe } from "lucide-react";
import BrandIcons from "@/data/brand-icons";

type DestinationItem = {
    name: string;
    lat: number;
    lng: number;
    color: string;
};

const destinationsData: DestinationItem[] = [
    { name: "موزیک", lat: 52.52, lng: 13.405, color: "#22c55e" },
    { name: "هنرمندان", lat: 40.7128, lng: -74.006, color: "#10b981" },
    { name: "طرفداران", lat: 51.5074, lng: -0.1278, color: "#34d399" },
    { name: "رویدادهای زنده", lat: 35.68, lng: 51.38, color: "#059669" },
    { name: "موزیک ویدئوها", lat: 45.4642, lng: 9.19, color: "#6ee7b7" },
    { name: "پادکست‌ها", lat: -33.8688, lng: 151.2093, color: "#047857" },
];

const SPOTIFY_MASK_PATH =
    "M255.998.004C114.617.004 0 114.616 0 255.998c0 141.385 114.617 255.994 255.998 255.994C397.395 511.992 512 397.387 512 255.998 512 114.624 397.395.015 255.994.015l.004-.015v.004zm117.4 369.22c-4.585 7.519-14.426 9.907-21.949 5.288-60.104-36.715-135.771-45.028-224.882-24.669-8.587 1.955-17.146-3.425-19.104-12.015-1.966-8.59 3.394-17.149 12.004-19.104 97.517-22.28 181.164-12.687 248.644 28.551 7.523 4.615 9.907 14.427 5.287 21.949zm31.335-69.704c-5.779 9.389-18.067 12.353-27.452 6.578-68.813-42.297-173.703-54.547-255.096-29.837-10.556 3.188-21.704-2.761-24.906-13.298-3.18-10.556 2.772-21.68 13.309-24.89 92.971-28.209 208.551-14.546 287.575 34.015 9.385 5.778 12.349 18.066 6.574 27.44v-.004l-.004-.004zm2.692-72.583c-82.51-49.006-218.635-53.511-297.409-29.603-12.649 3.836-26.027-3.302-29.859-15.955-3.833-12.657 3.302-26.024 15.959-29.868 90.428-27.452 240.753-22.149 335.747 34.245 11.401 6.755 15.133 21.447 8.375 32.809-6.728 11.378-21.462 15.13-32.802 8.372h-.011z";

function SpotifyVideoOrb() {
    const maskSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 511.992">
            <path fill="white" d="${SPOTIFY_MASK_PATH}" />
        </svg>
    `)}`;

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % destinationsData.length);
        }, 2200);

        return () => window.clearInterval(timer);
    }, []);

    const activeDest = destinationsData[currentIndex];

    return (
        <section className="relative w-full px-2 sm:px-4">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center rounded-[1.5rem] border border-slate-200/10 bg-white/[0.015] p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-6 pb-6 lg:p-8">
                <div className="relative flex h-[300px] w-full items-center justify-center rounded-[1.25rem] sm:h-[400px] sm:rounded-[1.75rem] lg:h-[520px]">
                    <div className="relative flex h-[260px] w-[260px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:h-[340px] sm:w-[340px] lg:h-[420px] lg:w-[420px]">
                        <div
                            className="absolute inset-0"
                            style={{
                                WebkitMaskImage: `url("${maskSvg}")`,
                                maskImage: `url("${maskSvg}")`,
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                            }}
                        >
                            <video
                                className="h-full w-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-label="A 15-second montage shows well-known creators smiling, laughing, dancing, and signing their names on the camera lens."
                                poster="https://wwwmarketing.scdn.co/static/images/premium/voyager/hero-mobile-poster.webp"
                            >
                                <source
                                    src="https://wwwmarketing.scdn.co/video/voyager/SPOTIFY_WEB_HERO_16x9_compressed.webm"
                                    type="video/webm"
                                />
                            </video>
                        </div>

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.18)_70%,rgba(0,0,0,0.72)_100%)]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/5" />
                        <div className="absolute left-1/2 top-6 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
                    </div>

                    <div className="absolute -bottom-3 z-10 rounded-full border border-slate-200/10 bg-slate-900/60 px-5 py-2 shadow-lg backdrop-blur-md sm:-bottom-2 sm:px-6 sm:py-2.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 sm:text-xs md:text-sm">
                            مقصد نهایی برای
                            <strong className="text-sm text-green-400 md:text-base">{activeDest.name}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    const features = [
        { icon: <BrandIcons.NoAds />, title: "حذف کامل تبلیغات" },
        { icon: <BrandIcons.OfflineDownload />, title: "دانلود و پخش آفلاین" },
        { icon: <BrandIcons.CustomOrder />, title: "پخش به ترتیب دلخواه" },
        { icon: <BrandIcons.HighQuality />, title: "کیفیت صدای 320KBPS" },
        { icon: <BrandIcons.GroupListen />, title: "پخش همزمان با دیگران" },
        { icon: <BrandIcons.CollaborativePlaylist />, title: "پلی‌لیست مشارکتی" },
        { icon: <BrandIcons.SmartAssistant />, title: "دستیار پلی‌لیست‌ساز" },
        { icon: <BrandIcons.MultiDevice />, title: "دسترسی روی چند دستگاه" },
        { icon: <BrandIcons.EmailActivation />, title: "فعال‌سازی روی ایمیل شخصی" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="relative flex min-h-[calc(100vh-160px)] flex-col items-center overflow-hidden pb-20">
            <div className="pointer-events-none absolute top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-green-500/5 blur-[120px]" />

            <section className="mx-auto mt-16 w-full max-w-7xl px-4 z-10 sm:mt-20">
                <div dir="rtl" className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    <motion.header
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="text-center lg:text-right"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-slate-300 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:text-sm">
                            <Sparkles className="h-4 w-4 text-green-400" />
                            <span>تجربه‌ای بدون مرز از شنیدن موسیقی</span>
                        </div>

                        <h1 className="mt-8 text-3xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.15]">
                            موسیقی برای همه لحظه‌ها، بدون وقفه با <br className="hidden lg:block" />
                            <span className="mt-1 inline-block bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text pb-2 text-transparent drop-shadow-lg">
                                اسپاتیفای
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 w-full px-6 text-base leading-relaxed text-slate-300/90 sm:text-lg md:text-xl md:leading-9 lg:mx-0 font-light">
                            اشتراک پرمیوم اسپاتیفای دنیایی از موسیقی را بدون تبلیغات و بدون محدودیت در اختیار شما قرار
                            می‌دهد. با فعال‌سازی آن، به پخش نامحدود، کنترل کامل روی موسیقی و بالاترین کیفیت صدا دسترسی
                            خواهید داشت.
                        </p>

                        <div className="mt-10 flex justify-center lg:justify-start">
                            <Link
                                href="/order"
                                className="group inline-flex items-center justify-center gap-3 rounded-full border border-green-300/20 bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-[0_16px_40px_-10px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_-10px_rgba(34,197,94,0.6)] sm:text-lg"
                            >
                                <span>خرید اشتراک</span>
                                <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-2" />
                            </Link>
                        </div>
                    </motion.header>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[620px]">
                            <SpotifyVideoOrb />
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative mt-24 w-full max-w-6xl px-4 pt-16 z-10"
            >
                <div className="absolute top-0 left-1/2 h-[1px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

                <div className="mb-12 text-center">
                    <h2 className="inline-flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/40 px-8 py-4 text-xl font-bold text-white backdrop-blur-md shadow-xl md:text-2xl lg:text-3xl">
                        <Globe className="w-6 h-6 text-green-400" />
                        تجربه‌ای بدون مرز از شنیدن موسیقی با
                    </h2>
                </div>

                <div className="mb-20 flex w-full flex-wrap justify-center gap-5 sm:gap-7 md:gap-9">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="group flex w-32 flex-col items-center gap-4 sm:w-40"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-slate-200/10 bg-white/[0.03] text-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-transform duration-300 group-hover:-translate-y-1 sm:h-24 sm:w-24">
                                <span className="text-4xl">{feature.icon}</span>
                            </div>
                            <span className="text-center text-sm font-medium text-slate-300 sm:text-base md:text-lg">
                                {feature.title}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
