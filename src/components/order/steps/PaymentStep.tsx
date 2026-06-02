"use client";

import ReceiptForm from "@/components/Receiptform";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, CreditCard, Wifi } from "lucide-react";

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
    onCopyCard: () => void;
    onCopySheba: () => void;
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

    const cardVariants = {
        rest: { scale: 1, y: 0, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" },
        hover: {
            scale: 1.02,
            y: -4,
            boxShadow: "0 28px 70px rgba(30,215,96,0.15)",
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
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
                        className="space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -18 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 16 }}
                            className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1ED760]/10 text-[#1ED760] rounded-full flex items-center justify-center mx-auto border-2 border-[#1ED760]/20 shadow-[0_0_20px_rgba(30,215,96,0.2)] relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-[#1ED760]/20 blur-xl"
                            />
                            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 relative z-10" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.5 }}
                            className="text-2xl sm:text-3xl font-bold text-white"
                        >
                            اطلاعات رسید پرداخت و کارت بانکی
                        </motion.h2>
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
                            className="text-zinc-400 text-sm leading-relaxed mb-6 px-2"
                        >
                            جهت پرداخت وجه، لطفاً مبلغ{" "}
                            <strong className="text-lg sm:text-xl text-[#1ED760]">
                                {price.toLocaleString("fa-IR")} تومان
                            </strong>{" "}
                            را به شماره کارت یا شماره شبا زیر واریز بفرمایید.
                        </motion.p>

                        <motion.div
                            //@ts-ignore
                            variants={cardVariants}
                            initial="rest"
                            whileHover="hover"
                            className="group relative w-full max-w-[550px] mx-auto rounded-3xl overflow-hidden border border-[#1ED760] bg-[#181818] text-left transform-gpu [transform-style:preserve-3d]"
                            style={{ perspective: 1200 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#282828]/50 via-[#121212] to-black z-0" />

                            <motion.div
                                //@ts-ignore
                                variants={glowVariants}
                                className="absolute top-0 right-0 w-36 h-36 bg-[#1ED760]/10 rounded-full blur-3xl z-0 pointer-events-none"
                            />
                            <motion.div
                                //@ts-ignore
                                variants={glowVariants}
                                className="absolute bottom-0 left-0 w-44 h-44 bg-white/5 rounded-full blur-3xl z-0 pointer-events-none"
                            />

                            <motion.div
                                //@ts-ignore
                                variants={shimmerVariants}
                                className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[#1ED760]/5 to-transparent blur-xl pointer-events-none"
                            />

                            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:22px_22px]" />

                            <div
                                className="relative z-10 h-full p-5 sm:p-6 flex flex-col gap-5"
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
                                                className="text-[#1ED760] font-bold text-base sm:text-xl tracking-wider drop-shadow-md"
                                            >
                                                بانک رسالت
                                            </motion.span>
                                            <motion.span
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.24, duration: 0.45 }}
                                                className="text-[10px] sm:text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5"
                                            >
                                                Bank Resalat
                                            </motion.span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 sm:gap-4 w-full">
                                        <motion.div
                                            animate={{ y: [0, -1.5, 0] }}
                                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative w-10 h-8 sm:w-12 sm:h-9 bg-gradient-to-br from-yellow-300 to-accent rounded-md flex items-center justify-center border border-accent/50 shadow-inner overflow-hidden shrink-0"
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
                                <div className="w-full space-y-4">
                                    <div className="w-full space-y-2">
                                        <span className="block text-right text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
                                            شماره کارت
                                        </span>

                                        <div className="flex items-center justify-between gap-2" dir="rtl">
                                            <motion.span
                                                dir="ltr"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.28, duration: 0.45 }}
                                                className="text-[1.05rem] sm:text-2xl font-mono text-white tracking-[0.12em] sm:tracking-[0.16em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                                style={{
                                                    transform: "translateZ(0)",
                                                    textRendering: "geometricPrecision",
                                                }}
                                            >
                                                5041 7212 1207 6674
                                            </motion.span>

                                            <motion.button
                                                whileHover={{ scale: 1.08, rotate: -3 }}
                                                whileTap={{ scale: 0.94 }}
                                                onClick={onCopyCard}
                                                className="p-2 shrink-0 cursor-pointer text-[#1ED760] hover:text-[#1ED760] hover:bg-[#282828] rounded-lg transition-colors bg-[#121212]/50 backdrop-blur-sm border border-[#1ED760] flex items-center justify-center"
                                                title="کپی شماره کارت"
                                                type="button"
                                            >
                                                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-2">
                                        <span className="block text-xs text-right sm:text-sm text-zinc-400 font-medium tracking-wide">
                                            شماره شبا
                                        </span>

                                        <div className="flex items-center justify-between gap-2" dir="rtl">
                                            <motion.span
                                                dir="ltr"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.32, duration: 0.45 }}
                                                className="text-[0.96rem] sm:text-xl font-mono text-white tracking-[0.1em] sm:tracking-[0.12em] break-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                                style={{
                                                    transform: "translateZ(0)",
                                                    textRendering: "geometricPrecision",
                                                }}
                                            >
                                                IR950700010001110988147001
                                            </motion.span>

                                            <motion.button
                                                whileHover={{ scale: 1.08, rotate: -3 }}
                                                whileTap={{ scale: 0.94 }}
                                                onClick={onCopySheba}
                                                className="p-2 shrink-0 cursor-pointer text-[#1ED760] hover:text-[#1ED760] hover:bg-[#282828] rounded-lg transition-colors bg-[#121212]/50 backdrop-blur-sm border border-[#1ED760] flex items-center justify-center"
                                                title="کپی شماره شبا"
                                                type="button"
                                            >
                                                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-auto flex justify-between items-end pt-1">
                                    <div className="flex flex-row items-center gap-3 text-right" dir="rtl">
                                        <span className="text-sm text-start text-zinc-500 tracking-widest mb-1">
                                            دارنده کارت :
                                        </span>
                                        <motion.span
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.34, duration: 0.45 }}
                                            className="text-white mb-1 text-base sm:text-lg font-semibold tracking-wide whitespace-nowrap"
                                            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
                                        >
                                            سپهر سخائی
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        animate={{ y: [0, -2, 0], rotate: [0, 1, 0] }}
                                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-[#1ED760]/50 shrink-0" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
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
