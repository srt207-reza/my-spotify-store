"use client";

import ReceiptForm from "@/components/Receiptform";
import { motion } from "framer-motion";
import { Copy, CreditCard, Wifi } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

const BANK_CARDS = [
    {
        bankName: "بانک رسالت",
        bankNameEn: "Bank Resalat",
        cardNumber: "5041721212076674",
        shebaNumber: "IR950700010001110988147001",
        cardHolder: "سپهر سخائی",
        theme: {
            border: "border-[#1ED760]",
            gradient: "from-[#282828]/50 via-[#121212] to-black",
            accentText: "text-[#1ED760]",
            glow: "bg-[#1ED760]/10",
            shimmer: "via-[#1ED760]/5",
            chip: "from-yellow-300 to-accent border-accent/50",
            copyButton: "text-[#1ED760] hover:text-[#1ED760] border-[#1ED760]",
            cardIcon: "text-[#1ED760]/50",
        },
    },
    {
        bankName: "بانک پاسارگاد",
        bankNameEn: "Bank Pasargad",
        cardNumber: "5022291583688278",
        shebaNumber: "IR730570077700005599422001",
        cardHolder: "سپهر سخائی",
        theme: {
            border: "border-[#F5A623]",
            gradient: "from-[#3a2a15]/70 via-[#1a140b] to-black",
            accentText: "text-[#F5A623]",
            glow: "bg-[#F5A623]/10",
            shimmer: "via-[#F5A623]/5",
            chip: "from-yellow-200 to-[#F5A623] border-[#F5A623]/50",
            copyButton: "text-[#F5A623] hover:text-[#F5A623] border-[#F5A623]",
            cardIcon: "text-[#F5A623]/50",
        },
    },
    {
        bankName: "بانک پارسیان",
        bankNameEn: "Bank Parsian",
        cardNumber: "6221061228436616",
        shebaNumber: "IR100540102320100718108601",
        cardHolder: "سپهر سخائی",
        theme: {
            border: "border-[#38BDF8]",
            gradient: "from-[#173249]/70 via-[#0c1720] to-black",
            accentText: "text-[#38BDF8]",
            glow: "bg-[#38BDF8]/10",
            shimmer: "via-[#38BDF8]/5",
            chip: "from-sky-200 to-[#38BDF8] border-[#38BDF8]/50",
            copyButton: "text-[#38BDF8] hover:text-[#38BDF8] border-[#38BDF8]",
            cardIcon: "text-[#38BDF8]/50",
        },
    },
] as const;

const BANK_CARD_SLIDES = [BANK_CARDS[2], BANK_CARDS[0], BANK_CARDS[1]];

type ReceiptPayload = {
    receiptNumber?: string;
    payerName?: string;
    depositTime?: string;
    bankName?: string;
    receiptImage?: string | null;
    note?: string;
};

type Props = {
    orderId: string;
    price: number;
    onCopyCard: (cardNumber: string) => void;
    onCopySheba: (shebaNumber: string) => void;
    onBack: () => void;
    onConfirmReceipt: (receiptData?: ReceiptPayload) => Promise<void>;
    loading?: boolean;
    supportLink?: string;
};

export default function PaymentStep({
    orderId,
    price,
    onCopyCard,
    onCopySheba,
    onBack,
    onConfirmReceipt,
    loading,
}: Props) {
    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.14, delayChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 22, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const glowVariants = {
        rest: { opacity: 0.35, scale: 1 },
        hover: { opacity: 0.65, scale: 1.08, transition: { duration: 0.45, ease: "easeOut" } },
    };

    const shimmerVariants = {
        rest: { x: "-120%" },
        hover: { x: "120%", transition: { duration: 1.2, ease: "easeInOut" } },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            key="step-payment-spotify"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 w-full"
        >
            {!orderId ? (
                <>
                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                    >
                        <div
                            className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-slate-800/50 border border-slate-700 mt-6 mb-4"
                        >
                            <Image
                                src="/assets/images/icons/Credit Card Info.png"
                                alt=""
                                width={40}
                                height={40}
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            اطلاعات رسید پرداخت و کارت بانکی
                        </h2>
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="flex flex-col items-center w-full"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.45 }}
                            className="text-zinc-400 text-xl leading-relaxed mb-6 px-2"
                        >
                            جهت پرداخت وجه، لطفاً مبلغ{" "}
                            <strong className="text-2xl sm:text-xl text-[#1ED760]">
                                {price.toLocaleString("fa-IR")} تومان
                            </strong>{" "}
                            را به شماره کارت یا شماره شبا زیر واریز بفرمایید.
                        </motion.p>

                        <div className="w-full mx-auto overflow-x-clip">
                            <Swiper
                                key="bank-cards-effect-no-loop"
                                dir="ltr"
                                modules={[EffectCards]}
                                effect="cards"
                                cardsEffect={{
                                    slideShadows: false,
                                    rotate: false,
                                    perSlideRotate: 0,
                                    perSlideOffset: 10,
                                }}
                                initialSlide={1}
                                speed={500}
                                grabCursor
                                slideToClickedSlide
                                className="w-[calc(100%-2rem)] sm:w-full max-w-[500px] mx-auto !overflow-visible [&_.swiper-slide-active]:!z-10"
                            >
                            {BANK_CARD_SLIDES.map((bankCard) => (
                                <SwiperSlide key={bankCard.cardNumber}>
                                    <motion.div
                                        initial="rest"
                                        className={`group relative w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden border ${bankCard.theme.border} bg-[#181818] text-left transform-gpu [transform-style:preserve-3d]`}
                                        style={{ perspective: 1200 }}
                                    >
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${bankCard.theme.gradient} z-0`}
                                        />

                                        <motion.div
                                            //@ts-ignore
                                            variants={glowVariants}
                                            className={`absolute top-0 right-0 w-36 h-36 ${bankCard.theme.glow} rounded-full blur-3xl z-0 pointer-events-none`}
                                        />
                                        <motion.div
                                            //@ts-ignore
                                            variants={glowVariants}
                                            className="absolute bottom-0 left-0 w-44 h-44 bg-white/5 rounded-full blur-3xl z-0 pointer-events-none"
                                        />

                                        <motion.div
                                            //@ts-ignore
                                            variants={shimmerVariants}
                                            className={`absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent ${bankCard.theme.shimmer} to-transparent blur-xl pointer-events-none`}
                                        />

                                        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:22px_22px]" />

                                        <div
                                            className="relative z-10 h-full p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
                                            dir="rtl"
                                            style={{
                                                transform: "translateZ(0)",
                                                backfaceVisibility: "hidden",
                                                WebkitBackfaceVisibility: "hidden",
                                            }}
                                        >
                                            <div className="flex justify-between w-full">
                                                <div className="flex justify-between items-start w-full" dir="rtl">
                                                    <div className="flex flex-col items-start w-full">
                                                        <motion.span
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.18, duration: 0.45 }}
                                                            className={`${bankCard.theme.accentText} font-bold text-base sm:text-xl tracking-wider`}
                                                        >
                                                            {bankCard.bankName}
                                                        </motion.span>
                                                        <motion.span
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.24, duration: 0.45 }}
                                                            className="text-[11px] sm:text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5"
                                                        >
                                                            {bankCard.bankNameEn}
                                                        </motion.span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-3 sm:gap-4 w-full">
                                                    <motion.div
                                                        animate={{ y: [0, -1.5, 0] }}
                                                        transition={{
                                                            duration: 2.6,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                        }}
                                                        className={`relative w-9 h-7 sm:w-12 sm:h-9 bg-gradient-to-br ${bankCard.theme.chip} rounded-md flex items-center justify-center border overflow-hidden shrink-0`}
                                                    >
                                                        <div className="w-full h-[1px] bg-yellow-700/40 absolute" />
                                                        <div className="w-[1px] h-full bg-yellow-700/40 absolute" />
                                                    </motion.div>

                                                    <motion.div
                                                        animate={{ rotate: [90, 92, 90] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                        className="shrink-0"
                                                    >
                                                        <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-store-muted/70" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-1">
                                                <div className="w-full space-y-1">
                                                    <span className="block text-right text-sm sm:text-[15px] text-zinc-400 font-medium tracking-wide">
                                                        شماره کارت
                                                    </span>

                                                    <div className="flex items-center justify-between gap-2" dir="rtl">
                                                        <motion.span
                                                            dir="ltr"
                                                            initial={{ opacity: 0, y: 8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.28, duration: 0.45 }}
                                                            className="text-[0.95rem] sm:text-2xl font-mono text-white tracking-[0.05em] sm:tracking-[0.16em] whitespace-nowrap"
                                                            style={{
                                                                transform: "translateZ(0)",
                                                                textRendering: "geometricPrecision",
                                                            }}
                                                        >
                                                            {bankCard.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                                                        </motion.span>

                                                        <motion.button
                                                            whileHover={{ scale: 1.08, rotate: -3 }}
                                                            whileTap={{ scale: 0.94 }}
                                                            onClick={() => onCopyCard(bankCard.cardNumber)}
                                                            className={`p-1.5 sm:p-2 shrink-0 cursor-pointer ${bankCard.theme.copyButton} hover:bg-[#282828] rounded-lg transition-colors bg-[#121212]/50 backdrop-blur-sm border flex items-center justify-center`}
                                                            title="کپی شماره کارت"
                                                            type="button"
                                                        >
                                                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                <div className="w-full space-y-1">
                                                    <span className="block text-sm text-right sm:text-[15px] text-zinc-400 font-medium tracking-wide">
                                                        شماره شبا
                                                    </span>

                                                    <div className="flex items-center justify-between gap-2" dir="rtl">
                                                        <motion.span
                                                            dir="ltr"
                                                            initial={{ opacity: 0, y: 8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.32, duration: 0.45 }}
                                                            className="text-xs sm:text-xl font-mono text-white tracking-normal sm:tracking-[0.12em] whitespace-nowrap"
                                                            style={{
                                                                transform: "translateZ(0)",
                                                                textRendering: "geometricPrecision",
                                                            }}
                                                        >
                                                            {bankCard.shebaNumber}
                                                        </motion.span>

                                                        <motion.button
                                                            whileHover={{ scale: 1.08, rotate: -3 }}
                                                            whileTap={{ scale: 0.94 }}
                                                            onClick={() => onCopySheba(bankCard.shebaNumber)}
                                                            className={`p-1.5 sm:p-2 shrink-0 cursor-pointer ${bankCard.theme.copyButton} hover:bg-[#282828] rounded-lg transition-colors bg-[#121212]/50 backdrop-blur-sm border flex items-center justify-center`}
                                                            title="کپی شماره شبا"
                                                            type="button"
                                                        >
                                                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full mt-auto flex justify-between items-end">
                                                <div className="flex min-w-0 flex-row items-center gap-1.5 sm:gap-3 text-right" dir="rtl">
                                                    <span className="text-xs sm:text-sm text-start text-zinc-500 tracking-wider sm:tracking-widest mb-1 whitespace-nowrap">
                                                        دارنده کارت :
                                                    </span>
                                                    <motion.span
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.34, duration: 0.45 }}
                                                        className="text-white mb-1 text-sm sm:text-lg font-semibold tracking-wide whitespace-nowrap"
                                                        style={{
                                                            transform: "translateZ(0)",
                                                            backfaceVisibility: "hidden",
                                                        }}
                                                    >
                                                        {bankCard.cardHolder}
                                                    </motion.span>
                                                </div>

                                                <motion.div
                                                    animate={{ y: [0, -2, 0], rotate: [0, 1, 0] }}
                                                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    <CreditCard
                                                        className={`w-6 h-6 sm:w-8 sm:h-8 ${bankCard.theme.cardIcon} shrink-0`}
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                            </Swiper>
                        </div>
                    </motion.div>
                </>
            ) : null}

            <motion.div
                //@ts-ignore
                variants={itemVariants}
                className="mt-8 w-full"
            >
                <ReceiptForm orderId={orderId} loading={!!loading} onSubmit={onConfirmReceipt} onBack={onBack} />
            </motion.div>
        </motion.div>
    );
}
