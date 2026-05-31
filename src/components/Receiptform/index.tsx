"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, Receipt } from "lucide-react";

const IRANIAN_BANKS = [
    "ملی ایران",
    "سپه",
    "تجارت",
    "ملت",
    "صادرات",
    "رسالت",
    "پارسیان",
    "پاسارگاد",
    "سامان",
    "سینا",
    "آینده",
    "شهر",
    "اقتصاد نوین",
    "کارآفرین",
    "دی",
    "ایران زمین",
    "خاورمیانه",
    "انصار",
    "مهر ایران",
    "توسعه صادرات",
    "صنعت و معدن",
    "کشاورزی",
    "مسکن",
    "پست بانک",
    "سایر",
];

type ReceiptPayload = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
};

type ReceiptFormProps = {
    orderId?: string;
    loading?: boolean;
    onBack: () => void;
    onSubmit: (receiptData: ReceiptPayload) => Promise<void>;
};

export default function ReceiptForm({ orderId, loading = false, onSubmit, onBack }: ReceiptFormProps) {
    const [payerName, setPayerName] = useState("");
    const [trackingCode, setTrackingCode] = useState("");
    const [sourceBank, setSourceBank] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({
        payerName: false,
        trackingCode: false,
        sourceBank: false,
    });
    const [bankOpen, setBankOpen] = useState(false);

    const payerNameValid = payerName.trim().length >= 3;
    const trackingCodeValid = trackingCode.trim().length >= 6;
    const sourceBankValid = sourceBank.trim().length > 0;
    const canSubmit = payerNameValid && trackingCodeValid && sourceBankValid;

    const handleSubmit = async () => {
        setTouched({
            payerName: true,
            trackingCode: true,
            sourceBank: true,
        });

        if (!canSubmit) return;

        setLocalLoading(true);
        try {
            await onSubmit({
                payerName: payerName.trim(),
                trackingCode: trackingCode.trim(),
                sourceBank,
            });

            setSubmitted(true);
        } catch (err: any) {
            alert(err?.message || "خطایی رخ داد. دوباره تلاش کنید.");
        } finally {
            setLocalLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 14 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {submitted ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#181818]/80 border border-[#1ED760]/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 relative overflow-hidden"
                    dir="rtl"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-3xl bg-[#1ED760]/5 pointer-events-none"
                    />
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-16 h-16 bg-[#1ED760]/10 border-2 border-[#1ED760]/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(30,215,96,0.25)] relative z-10"
                    >
                        <CheckCircle2 className="w-8 h-8 text-[#1ED760]" />
                    </motion.div>

                    <div className="space-y-1 relative z-10">
                        <p className="text-white font-bold text-lg sm:text-xl">رسید شما با موفقیت ثبت شد!</p>
                        <p className="text-zinc-400 text-sm">سفارش شما در اسرع وقت بررسی و تأیید خواهد شد.</p>
                    </div>

                    <div className="relative z-10 space-y-2">
                        <p className="text-zinc-500 text-xs">کد پیگیری سفارش</p>
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="inline-flex items-center gap-2 bg-[#1ED760]/10 border border-[#1ED760]/25 rounded-2xl px-5 py-3"
                        >
                            <span className="font-mono text-[#1ED760] text-xl sm:text-2xl font-bold tracking-widest">
                                {orderId || "در حال ساخت..."}
                            </span>
                        </motion.div>
                        <p className="text-zinc-600 text-xs pt-1">این کد را جهت پیگیری نزد خود نگه دارید</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#181818]/80 border border-[#282828] rounded-3xl p-5 sm:p-6 space-y-5 relative text-right"
                    dir="rtl"
                >
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.16, 0.08] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-40 h-40 bg-[#1ED760]/20 rounded-full blur-3xl pointer-events-none"
                    />

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="flex items-center gap-3 relative z-10"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#1ED760]/10 border border-[#1ED760]/20 flex items-center justify-center shrink-0">
                            <Receipt className="w-4 h-4 text-[#1ED760]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm sm:text-base">اطلاعات رسید پرداخت</p>
                            <p className="text-zinc-500 text-xs mt-0.5">پس از واریز، اطلاعات زیر را تکمیل کنید</p>
                        </div>
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="relative z-10 space-y-1.5"
                    >
                        <label className="text-zinc-300 text-sm font-medium flex items-center gap-1">
                            نام واریزکننده <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="نام و نام خانوادگی"
                            value={payerName}
                            onChange={(e) => setPayerName(e.target.value)}
                            onBlur={() => setTouched((p) => ({ ...p, payerName: true }))}
                            className={`w-full bg-[#121212] border rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm outline-none transition-all duration-200
                                ${
                                    touched.payerName && !payerNameValid
                                        ? "border-red-500/60"
                                        : payerNameValid
                                          ? "border-[#1ED760]/40 focus:border-[#1ED760]"
                                          : "border-[#282828] focus:border-zinc-500"
                                }`}
                        />
                        {touched.payerName && !payerNameValid && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs"
                            >
                                الزامی
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="relative z-10 space-y-1.5"
                    >
                        <label className="text-zinc-300 text-sm font-medium flex items-center gap-1">
                            کد رهگیری <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="کد رهگیری تراکنش"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value.replace(/\D/g, ""))}
                            onBlur={() => setTouched((p) => ({ ...p, trackingCode: true }))}
                            dir="ltr"
                            className={`w-full bg-[#121212] border rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm outline-none transition-all duration-200 text-right
                                ${
                                    touched.trackingCode && !trackingCodeValid
                                        ? "border-red-500/60"
                                        : trackingCodeValid
                                          ? "border-[#1ED760]/40 focus:border-[#1ED760]"
                                          : "border-[#282828] focus:border-zinc-500"
                                }`}
                        />
                        {touched.trackingCode && !trackingCodeValid && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs"
                            >
                                الزامی (حداقل ۶ رقم)
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="relative z-20 space-y-1.5"
                    >
                        <label className="text-zinc-300 text-sm font-medium flex items-center gap-1">
                            بانک مبدأ <span className="text-red-400">*</span>
                        </label>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setBankOpen((o) => !o)}
                                className={`w-full bg-[#121212] border cursor-pointer rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 flex items-center justify-between
                                    ${
                                        touched.sourceBank && !sourceBankValid
                                            ? "border-red-500/60"
                                            : sourceBankValid
                                              ? "border-[#1ED760]/40"
                                              : "border-[#282828]"
                                    }
                                    ${bankOpen ? "border-zinc-500" : ""}`}
                            >
                                <span className={sourceBank ? "text-white" : "text-zinc-600"}>
                                    {sourceBank ? `بانک ${sourceBank}` : "انتخاب کنید"}
                                </span>
                                <motion.span animate={{ rotate: bankOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {bankOpen && (
                                    <motion.ul
                                        initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ transformOrigin: "top" }}
                                        className="absolute !scrollbar-hide top-full mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded-xl overflow-y-auto max-h-52 z-30 shadow-2xl"
                                    >
                                        {IRANIAN_BANKS.map((bank) => (
                                            <li key={bank}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSourceBank(bank);
                                                        setBankOpen(false);
                                                        setTouched((p) => ({ ...p, sourceBank: true }));
                                                    }}
                                                    className={`w-full cursor-pointer text-right px-4 py-2.5 text-sm transition-colors
                                                        ${
                                                            sourceBank === bank
                                                                ? "text-[#1ED760] bg-[#1ED760]/10"
                                                                : "text-zinc-300 hover:bg-[#282828] hover:text-white"
                                                        }`}
                                                >
                                                    {bank === "سایر" ? bank : `بانک ${bank}`}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>

                        {touched.sourceBank && !sourceBankValid && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs"
                            >
                                الزامی
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="relative z-10 flex flex-col-reverse gap-3 pt-2 sm:flex-row"
                    >
                        <button
                            onClick={onBack}
                            className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 sm:w-auto"
                        >
                            بازگشت
                        </button>

                        <motion.button
                            whileHover={canSubmit && !loading && !localLoading ? { scale: 1.02, y: -2 } : {}}
                            whileTap={canSubmit && !loading && !localLoading ? { scale: 0.98 } : {}}
                            onClick={handleSubmit}
                            disabled={loading || localLoading}
                            className={`relative w-full py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 overflow-hidden
                                ${
                                    canSubmit && !loading && !localLoading
                                        ? "bg-[#1ED760] text-black hover:bg-[#1fdf64] shadow-[0_0_20px_rgba(30,215,96,0.3)] cursor-pointer"
                                        : "bg-[#282828] text-zinc-500 cursor-not-allowed"
                                }`}
                        >
                            {canSubmit && !loading && !localLoading && (
                                <motion.span
                                    animate={{ x: [-60, 260] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                    className="absolute inset-y-0 w-20 bg-white/15 blur-xl pointer-events-none"
                                />
                            )}

                            {loading || localLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="relative z-10">تأیید و ثبت رسید پرداخت</span>
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
