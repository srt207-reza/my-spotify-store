"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    CreditCard,
    FileText,
    MapPin,
    Package,
    PlayCircle,
    RefreshCw,
    Shield,
    User,
    Users,
} from "lucide-react";
import Image from "next/image";

type TermItem = {
    id: number;
    icon: ReactNode;
    title?: string;
    paragraphs: ReactNode[];
};

type Plan = {
    id: "personal" | "group";
    label: string;
    icon: ReactNode;
    items: TermItem[];
};

const spotifyPaidTermsLink = "https://www.spotify.com/legal/paid-subscription-terms";

export default function TermsPage() {
    const [activePlan, setActivePlan] = useState<Plan["id"]>("personal");

    const plans: Plan[] = [
        {
            id: "personal",
            label: "قوانین و ویژگی‌های طرح شخصی اسپاتیفای",
            icon: <User className="h-6 w-6" />,
            items: [
                {
                    id: 1,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/IP restriction.png"
                        alt="IP_restriction"
                        width={36}
                        height={36}
                    />,
                    title: "محدودیت در آدرس اتصال اینترنتی (IP Address)",
                    paragraphs: [
                        "طبق قوانین و شرایط استفاده (Terms of Use) اسپاتیفای، موقعیت مکانی ثبت‌شده در حساب کاربری باید با موقعیت مکانی اتصال اینترنتی (IP Address) دستگاه کاربر یکسان باشد. بنابراین، استفاده از سرویس VPN متناسب با موقعیت مکانی ثبت‌شده در حساب کاربری اسپاتیفای هنگام استفاده از این سرویس برای کاربران ضروری است. در غیر این صورت، اسپاتیفای می‌تواند بدون اطلاع قبلی نسبت به لغو اشتراک پرمیوم اقدام نماید.",
                        "از آن‌جا که این موضوع مربوط به سیاست‌های داخلی اسپاتیفای بوده و خارج از کنترل مجموعه ما به‌عنوان واسطه خرید اشتراک پرمیوم است، در صورت لغو اشتراک توسط اسپاتیفای به‌دلیل عدم رعایت قوانین و شرایط استفاده، امکان جبران خسارت وجود نخواهد داشت.",
                        <>
                            جهت کسب اطلاعات تکمیلی در مورد محدودیت در آدرس اتصال اینترنتی (IP Address)، لطفاً با کلیک بر روی این{" "}
                            <a
                                href={spotifyPaidTermsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-spotify-light underline decoration-spotify-light/40 underline-offset-4 hover:text-spotify"
                            >
                                لینک
                                {/* <ExternalLink className="h-4 w-4" /> */}
                            </a>
                            {"، شرایط و قوانین جدید اشتراک پرمیوم اسپاتیفای را مطالعه بفرمایید."}
                        </>,
                    ],
                },
                {
                    id: 2,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/premium transfer.png"
                        alt="premium_transfer"
                        width={36}
                        height={36}
                    />,
                    title: "انتقال اشتراک پرمیوم",
                    paragraphs: [
                        "فعال‌سازی اشتراک پرمیوم صرفاً روی حساب کاربری اعلام‌شده در زمان ثبت سفارش انجام می‌گیرد. پس از تکمیل فرآیند فعال‌سازی، به‌دلیل ساختار سیستمی سرویس، امکان لغو، جابجایی، انتقال مدت‌زمان باقی‌مانده یا تغییر حساب کاربری مقصد، تحت هیچ شرایطی وجود نخواهد داشت. بنابراین لطفاً پیش از ثبت سفارش، از صحت اکانت انتخابی اطمینان حاصل بفرمایید.",
                    ],
                },
                {
                    id: 3,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/faal sazi ru hame.png"
                        alt="faal_sazi_ru_hame"
                        width={36}
                        height={36}
                    />,
                    title: "قابل فعال‌سازی بر روی کلیه حساب‌های کاربری اسپاتیفای",
                    paragraphs: [
                        "در صورتی که به دلیل محدودیت‌های طرح گروهی، امکان فعال‌سازی اشتراک پرمیوم در این طرح وجود نداشته باشد، طرح شخصی به‌عنوان تنها راهکار جایگزین مناسب معرفی خواهد شد.",
                    ],
                },
                {
                    id: 4,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Activation time.png"
                        alt="Activation_time"
                        width={36}
                        height={36}
                    />,
                    title: "فعال‌سازی در کمتر از ۲۴ ساعت",
                    paragraphs: [
                        "در صورت صحیح بودن اطلاعات حساب کاربری اسپاتیفای و همچنین فعال نبودن هیچ اشتراک پرمیوم دیگر، فرآیند فعال‌سازی اشتراک پرمیوم خریداری‌شده در کمتر از 24 ساعت، به‌صورت خودکار پس از پرداخت انجام خواهد شد.",
                    ],
                },
                {
                    id: 5,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Data saving.png"
                        alt="Data_saving"
                        width={36}
                        height={36}
                    />,
                    title: "حفظ کامل اطلاعات ذخیره‌شده در حساب کاربری",
                    paragraphs: [
                        "در فعال‌سازی طرح شخصی، کلیه اطلاعات حساب کاربری اسپاتیفای از جمله موزیک‌ها، پلی‌لیست‌ها و سایر اطلاعات ذخیره‌شده بدون هیچ تغییری حفظ می‌گردد و اشتراک پرمیوم مستقیماً روی همان حساب کاربری فعلی فعال می‌گردد.",
                    ],
                },
                {
                    id: 6,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Location & Time changes.png"
                        alt="Location_&_Time_changes"
                        width={36}
                        height={36}
                    />,
                    title: "تغییرات امکانات بر اساس موقعیت مکانی و بازه زمانی",
                    paragraphs: [
                        "برخی از امکانات و قابلیت‌های جانبی طرح پرمیوم اسپاتیفای (مانند پادکست‌ها، پلی‌لیست‌ها، کتاب‌های صوتی یا موزیک ویدیو) ممکن است بسته به موقعیت مکانی کاربران یا در بازه‌های زمانی مختلف سال، طبق تصمیم اسپاتیفای متفاوت باشد. بنابراین در دسترس نبودن یا غیرفعال شدن موقت برخی قابلیت‌ها به دلیل محدودیت‌های مجوز یا اجرای تدریجی آن‌ها، در طول مدت اعتبار اشتراک پرمیوم امری طبیعی بوده و این تغییرات مطابق با سیاست‌های داخلی اسپاتیفای صورت می‌گیرد.",
                    ],
                },
                {
                    id: 7,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Content restriction.png"
                        alt="Content_restriction"
                        width={36}
                        height={36}
                    />,
                    title: "محدودیت‌های محتوایی و قوانین حق پخش",
                    paragraphs: [
                        "با توجه به این‌که اسپاتیفای صرفاً یک پلتفرم پخش آنلاین است، ناشران و صاحبان آثار ممکن است در مقاطع مختلف تصمیم به محدود کردن یا توقف همکاری خود با اسپاتیفای بگیرند. همچنین به دلیل مسائل مربوط به قوانین حق پخش (Copyright)، برخی محتواها ممکن است به‌طور موقت از دسترس خارج شده و پس از مدتی دوباره در دسترس قرار گیرند. بنابراین در دسترس نبودن یا غیرفعال شدن موقت بخشی از محتوا در طول اعتبار اشتراک پرمیوم، امری طبیعی بوده و این تغییرات مطابق با تصمیم ناشر اثر یا قوانین حق پخش صورت می‌گیرد.",
                    ],
                },
                {
                    id: 8,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Legal payment.png"
                        alt="Legal_payment"
                        width={36}
                        height={36}
                    />,
                    title: "پرداخت قانونی با استفاده از حساب‌های ارزی معتبر",
                    paragraphs: [
                        "پرداخت‌های مربوط به فعال‌سازی اشتراک پرمیوم، به‌صورت قانونی و با استفاده از کارت‌های بانکی ثبت‌شده مجموعه در کشورهای هند، پاکستان، ترکیه، نیجریه و غیره انجام می‌گردد. پس از فعال‌سازی اشتراک پرمیوم، رسید رسمی پرداخت مستقیماً در حساب کاربری اسپاتیفای نمایش داده می‌شود که این موضوع صحت و قانونی بودن اشتراک پرمیوم خریداری‌شده را تأیید می‌کند.",
                    ],
                },
                {
                    id: 9,
                    icon: <Image
                        src="/assets/images/terms/Individual Rules/Non-refundable payment.png"
                        alt="Non-refundable_payment"
                        width={36}
                        height={36}
                    />,
                    title: "پرداخت قطعی و غیرقابل بازگشت",
                    paragraphs: [
                        "با توجه به قوانین اسپاتیفای، پس از انجام پرداخت و شروع فرآیند فعال‌سازی طرح شخصی، امکان لغو یا بازگشت مبلغ وجود ندارد.",
                    ],
                },
            ],
        },
        {
            id: "group",
            label: "قوانین و ویژگی‌های طرح گروهی اسپاتیفای",
            icon: <Users className="h-6 w-6" />,
            items: [
                {
                    id: 1,
                    icon: <FileText className="h-6 w-6 text-spotify-light" />,
                    paragraphs: [
                        "هر کاربر در پلن گروهی فقط یک‌بار در هر ۱۲ ماه مجاز به تغییر آدرس ثبت‌شده است. این محدودیت برای جلوگیری از سوءاستفاده و حفظ شرایط استفاده منصفانه اعمال می‌شود. بنابراین، در صورتی که به دلیل محدودیت‌های طرح گروهی، امکان فعال‌سازی اشتراک پرمیوم در این طرح وجود نداشته باشد، طرح شخصی به‌عنوان تنها راهکار جایگزین مناسب معرفی خواهد شد.",
                    ],
                },
                {
                    id: 2,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Long term plans.png"
                        alt="Long_term_plans"
                        width={36}
                        height={36}
                    />,
                    title: "بسته‌های بلندمدت اشتراک",
                    paragraphs: [
                        "طبق قوانین طرح گروهی اسپاتیفای، فعال‌سازی اشتراک پرمیوم گروهی برای هر حساب کاربری تنها دو مرتبه در هر سال امکان‌پذیر است. بنابراین به‌منظور جلوگیری از بروز محدودیت‌های این طرح، اشتراک‌های گروهی تنها در بسته‌های زمانی بلندمدت ‌۶ ماهه و ۱۲ ‌ماهه ارائه می‌گردند.",
                    ],
                },
                {
                    id: 3,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Non-refundable payment.png"
                        alt="Non-refundable_payment"
                        width={36}
                        height={36}
                    />,
                    title: "پرداخت قطعی و غیرقابل بازگشت",
                    paragraphs: [
                        "با توجه به قوانین اسپاتیفای، پس از انجام پرداخت و شروع فرآیند فعال‌سازی طرح شخصی، امکان لغو یا بازگشت مبلغ وجود ندارد.",
                    ],
                },
                {
                    id: 4,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/IP restriction.png"
                        alt="IP_restriction"
                        width={36}
                        height={36}
                    />,
                    title: "محدودیت در آدرس اتصال اینترنتی  (IP Address)",
                    paragraphs: [
                        "طبق قوانین و شرایط استفاده (Terms of Use) اسپاتیفای، موقعیت مکانی ثبت‌شده در حساب کاربری باید با موقعیت مکانی اتصال اینترنتی دستگاه کاربر یکسان باشد. بنابراین، استفاده از سرویس VPN متناسب با موقعیت مکانی ثبت‌شده در حساب کاربری اسپاتیفای هنگام استفاده از این سرویس برای کاربران ضروری است. در غیر این صورت، اسپاتیفای می‌تواند بدون اطلاع قبلی نسبت به لغو اشتراک پرمیوم اقدام نماید.",
                        <>
                            جهت کسب اطلاعات تکمیلی در مورد محدودیت در آدرس اتصال اینترنتی (IP Address)، لطفاً با کلیک بر روی این{" "}
                            <a
                                href={spotifyPaidTermsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-spotify-light underline decoration-spotify-light/40 underline-offset-4 hover:text-spotify"
                            >
                                لینک
                            </a>
                            {"، شرایط و قوانین جدید اشتراک پرمیوم اسپاتیفای را مطالعه بفرمایید."}
                        </>,
                    ],
                },
                {
                    id: 5,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Cancelation Gaurantee.png"
                        alt="Cancelation_Gaurantee"
                        width={36}
                        height={36}
                    />,
                    title: "ضمانت جبران زمان باقی‌مانده از اعتبار اشتراک پرمیوم",
                    paragraphs: [
                        "در صورت بروز هرگونه اختلال در اشتراک پرمیوم طی مدت اعتبار طرح پلن گروهی، باقی‌مانده از زمان اشتراک پرمیوم، طی کد تخفیف جهت ارتقاء به پلن شخصی(Individual)  به کاربر ارائه می‌گردد.",
                    ],
                },
                {
                    id: 6,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/premium transfer.png"
                        alt="premium_transfer"
                        width={36}
                        height={36}
                    />,
                    title: "انتقال اشتراک پرمیوم",
                    paragraphs: [
                        "اشتراک پرمیوم فعال‌ شده بر روی یک حساب کاربری، در صورت نیاز و با هماهنگی پشتیبانی، قابل انتقال به حساب کاربری دیگر می‌باشد. لطفاً توجه داشته باشید که صرفاً مدت‌زمان باقی‌مانده اشتراک پرمیوم قابل انتقال خواهد بود و پس از ثبت درخواست، در کوتاه‌ترین زمان ممکن بررسی و اجرا خواهد شد.",
                        "در صورت تمایل به جابجایی اشتراک، لطفاً از طریق پشتیبانی با ما در ارتباط باشید تا راهنمایی لازم ارائه گردد.",
                    ],
                },
                {
                    id: 7,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Activation time.png"
                        alt="Activation_time"
                        width={36}
                        height={36}
                    />,
                    title: "فعال‌سازی در کمتر از ۲۴ ساعت",
                    paragraphs: [
                        "در صورت صحیح بودن اطلاعات حساب کاربری اسپاتیفای ارائه‌شده از سوی کاربر و عدم فعال بودن هیچ اشتراک پرمیوم دیگری روی آن، اشتراک پرمیوم خریداری‌شده ظرف کمتر از ۲۴ ساعت پس از پرداخت به‌صورت خودکار فعال خواهد شد.",
                    ],
                },
                {
                    id: 8,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Economic price.png"
                        alt="Economic_price"
                        width={36}
                        height={36}
                    />,
                    title: "قیمت اقتصادی",
                    paragraphs: [
                        "طرح‌های گروهی اشتراک پرمیوم اسپاتیفای نسبت به طرح‌های شخصی (Individual) با قیمتی اقتصادی‌تر ارائه می‌گردد.",
                    ],
                },
                {
                    id: 9,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Location & Time changes.png"
                        alt="Location_&_Time changes"
                        width={36}
                        height={36}
                    />,
                    title: "تغییرات امکانات بر اساس موقعیت مکانی و بازه زمانی",
                    paragraphs: [
                        "برخی از امکانات و قابلیت‌های جانبی طرح پرمیوم اسپاتیفای (مانند پادکست‌ها، پلی‌لیست‌ها، کتاب‌های صوتی یا موزیک ویدیو) ممکن است بسته به موقعیت مکانی کاربران یا در بازه‌های زمانی مختلف سال، طبق تصمیم اسپاتیفای متفاوت باشد. بنابراین در دسترس نبودن یا غیرفعال شدن موقت برخی قابلیت‌ها به دلیل محدودیت‌های مجوز یا اجرای تدریجی آن‌ها، در طول مدت اعتبار اشتراک پرمیوم امری طبیعی بوده و این تغییرات مطابق با سیاست‌های داخلی اسپاتیفای صورت می‌گیرد.",
                    ],
                },
                {
                    id: 10,
                    icon: <Image
                        src="/assets/images/terms/Family Rules/Content restriction.png"
                        alt="Content_restriction"
                        width={36}
                        height={36}
                    />,
                    title: "محدودیت‌های محتوایی و قوانین حق پخش",
                    paragraphs: [
                        "با توجه به این‌که اسپاتیفای صرفاً یک پلتفرم پخش آنلاین است، ناشران و صاحبان آثار ممکن است در مقاطع مختلف تصمیم به محدود کردن یا توقف همکاری خود با اسپاتیفای بگیرند. همچنین به دلیل مسائل مربوط به قوانین حق پخش (Copyright)، برخی محتواها ممکن است به‌طور موقت از دسترس خارج شده و پس از مدتی دوباره در دسترس قرار گیرند. بنابراین در دسترس نبودن یا غیرفعال شدن موقت بخشی از محتوا در طول اعتبار اشتراک پرمیوم، امری طبیعی بوده و این تغییرات مطابق با تصمیم ناشر اثر یا قوانین حق پخش صورت می‌گیرد.",
                    ],
                },
            ],
        },
    ];

    const selectedPlan = plans.find((plan) => plan.id === activePlan) ?? plans[0];

    return (
        <section className="min-h-screen bg-store-base pb-20 text-white" dir="rtl">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center md:mb-14"
                >
                    <h1 className="my-10 text-4xl font-bold text-white md:text-6xl">
                        بخش مقررات و قوانین
                    </h1>
                </motion.div>

                <div
                    className="relative mx-auto mb-10 flex w-full max-w-[880px] overflow-hidden rounded-[999px] bg-[#242424] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    role="tablist"
                    aria-label="قوانین و ویژگی‌های طرح‌ها"
                >
                    {plans.map((plan) => {
                        const isActive = plan.id === activePlan;

                        return (
                            <button
                                key={plan.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActivePlan(plan.id)}
                                className={`relative z-10 flex min-h-[68px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[999px] border border-transparent px-2 text-center text-[11px] font-medium transition-colors duration-300 sm:min-h-[72px] sm:gap-3 sm:px-5 sm:text-base md:text-lg ${isActive ? "text-white" : "text-white/85 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <motion.span
                                        data-active-plan-indicator="true"
                                        layoutId="active-plan-indicator"
                                        aria-hidden="true"
                                        transition={{ type: "spring", stiffness: 420, damping: 40, mass: 0.7 }}
                                        className="pointer-events-none absolute inset-0 rounded-[999px] border border-emerald-500/70 bg-[#1f1f1f] shadow-[0_0_22px_rgba(29,185,84,0.42),0_12px_34px_rgba(29,185,84,0.18),inset_0_1px_0_rgba(255,255,255,0.04)]"
                                    />
                                )}

                                <span
                                    className={`relative z-10 shrink-0 transition-colors [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-6 sm:[&_svg]:w-6 ${isActive ? "text-white" : "text-white/70"
                                        }`}
                                >
                                    {plan.icon}
                                </span>
                                <span className="relative z-10 min-w-0 whitespace-normal leading-5 sm:leading-7">
                                    {plan.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <motion.div
                    key={selectedPlan.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                >
                    <h2 className="sr-only">{selectedPlan.label}</h2>

                    {selectedPlan.items.map((term, index) => (
                        <motion.article
                            key={term.id}
                            initial={{ opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="group rounded-2xl border border-store-border bg-store-panel p-5 transition-colors hover:bg-store-hover md:p-7"
                        >
                            <div className="flex flex-col gap-5 md:flex-row md:items-start">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-store-border/60 bg-store-card transition-transform group-hover:scale-105">
                                    {term.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                    {term.title && (
                                        <h3 className="mb-3 text-lg font-bold leading-8 text-white md:text-xl">
                                            {term.title}
                                        </h3>
                                    )}

                                    <div className="space-y-3 text-justify text-sm leading-8 text-slate-300 sm:text-base sm:leading-9">
                                        {term.paragraphs.map((paragraph, paragraphIndex) => (
                                            <p key={paragraphIndex}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
