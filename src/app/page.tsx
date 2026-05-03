"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Globe2, Globe } from "lucide-react";
import BrandIcons from "@/data/brand-icons";

// فراخوانی داینامیک کامپوننت کره زمین
const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
    ssr: false,
    loading: () => <GlobeFallback />,
});

// داده‌های چرخشی برای زیر کره زمین
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

const globeData = destinationsData.map((dest, index) => ({
    order: index + 1,
    startLat: 35.68,
    startLng: 51.38,
    endLat: dest.lat,
    endLng: dest.lng,
    arcAlt: 0.22 + (index % 4) * 0.05,
    color: dest.color,
}));

const globeConfig = {
    pointSize: 1.2,
    globeColor: "#020617",
    showAtmosphere: true,
    atmosphereColor: "#22c55e",
    atmosphereAltitude: 0.15,
    polygonColor: "rgba(255, 255, 255, 0.7)",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 2,
    maxRings: 3,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
};

function GlobeFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center px-4" aria-label="در حال بارگذاری">
            <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/10 bg-white/[0.02] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:p-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56">
                        <div className="absolute inset-0 animate-pulse rounded-full border border-slate-200/10" />
                        <div className="absolute inset-6 rounded-full border border-slate-200/10" />
                        <div className="absolute inset-12 rounded-full border border-slate-200/10" />
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/10 bg-white/[0.03]">
                            <Globe2 className="h-10 w-10 text-slate-300/80" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-400">مقصد نهایی</p>
                        <p className="mt-2 text-sm text-slate-500">در حال آماده‌سازی نمایش سه‌بعدی…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlobeSection() {
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
                    <div className="absolute inset-0 flex items-center justify-center">
                        <World globeConfig={globeConfig} data={globeData} />
                    </div>

                    <div className="absolute -bottom-3 z-10 rounded-full border border-slate-200/10 bg-slate-900/60 px-5 py-2 backdrop-blur-md sm:bottom-0 sm:px-6 sm:py-2.5 shadow-lg">
                        <span className="text-[11px] font-medium text-slate-300 sm:text-xs md:text-sm flex items-center gap-1.5">
                            مقصد نهایی برای <strong className="text-green-400 text-sm md:text-base">{activeDest.name}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
    // ویژگی‌های آیکون‌دار (بخش بدون تغییر با ظاهر حفظ شده)
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
        <div className="flex min-h-[calc(100vh-160px)] flex-col items-center pb-20 overflow-hidden relative">
            
            {/* افکت نوری پس‌زمینه */}
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* ==== بخش اول: متون اصلی و کره زمین ==== */}
            <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:mt-20 z-10">
                <div dir="rtl" className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    
                    {/* ستون راست: متن‌ها */}
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

                        <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.15]">
                            موسیقی برای همه لحظه‌ها، <br className="hidden lg:block" />
                            <span className="mt-1 inline-block bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text pb-2 text-transparent drop-shadow-lg">
                                بدون وقفه با اسپاتیفای
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 w-full px-6 text-base leading-relaxed text-slate-300/90 sm:text-lg md:text-xl md:leading-9 lg:mx-0 font-light">
                            اشتراک پرمیوم اسپاتیفای دنیایی از موسیقی را بدون تبلیغات و بدون محدودیت در اختیار شما قرار می‌دهد. با فعال‌سازی آن، به پخش نامحدود، کنترل کامل روی موسیقی و بالاترین کیفیت صدا دسترسی خواهید داشت.
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

                    {/* ستون چپ: کره زمین */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[620px]">
                            <GlobeSection />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* ==== بخش دوم: آیکون‌ها و ویژگی‌ها (حفظ شده دقیقاً مشابه قبل) ==== */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative w-full max-w-6xl mt-24 px-4 z-10 pt-16"
            >
                {/* خط جداکننده محو */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

                <div className="text-center mb-12">
                    <h2 className="inline-flex items-center gap-3 text-xl md:text-2xl lg:text-3xl font-bold text-white bg-slate-800/40 px-8 py-4 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-xl">
                        <Globe className="w-6 h-6 text-green-400" />
                        تجربه‌ای بدون مرز از شنیدن موسیقی با
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 justify-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            className="group flex flex-col items-center text-center gap-5 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800/80 hover:border-green-500/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-green-500/10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-inner border border-slate-700/50 group-hover:border-green-500/30 transition-colors">
                                <div className="scale-110 transition-transform duration-300 group-hover:scale-125">
                                    {feature.icon}
                                </div>
                            </div>
                            <h4 className="text-slate-300 group-hover:text-white font-medium text-sm md:text-base leading-snug transition-colors">
                                {feature.title}
                            </h4>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

        </div>
    );
}
