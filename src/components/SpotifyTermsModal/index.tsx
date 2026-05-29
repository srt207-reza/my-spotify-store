"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";

interface SpotifyTermsModalProps {
    open: boolean;
    acceptedTerms: boolean;
    onClose: () => void;
    onToggleAccepted: () => void;
    onConfirm: () => void;
    loading?: boolean;
    rulesHref?: string;
}

export default function SpotifyTermsModal({
    open,
    acceptedTerms,
    onClose,
    onToggleAccepted,
    onConfirm,
    loading = false,
    rulesHref = "/terms",
}: SpotifyTermsModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        dir="rtl"
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 24 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#2f2f2f] bg-[#121212] shadow-2xl"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1DB954] via-[#1ED760] to-emerald-300" />

                        <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5 md:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1ED760]/15 text-[#1ED760]">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white md:text-xl">
                                        تأیید شرایط قبل از پرداخت
                                    </h3>
                                    <p className="mt-1 text-sm text-zinc-400">یک مرحله کوتاه برای ادامه سفارش</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full cursor-pointer border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="بستن مودال"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5 p-5 md:p-6">
                            <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-4 leading-8 text-justify text-zinc-200">
                                با انتخاب گزینه زیر، تأیید می‌کنم که{" "}
                                <a
                                    href={rulesHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-[#1ED760] underline decoration-[#1ED760]/40 underline-offset-4 transition-colors hover:text-[#1fdf64]"
                                >
                                    شرایط و قوانین اشتراک پرمیوم اسپاتیفای
                                </a>{" "}
                                را مطالعه کرده‌ام و می‌پذیرم.
                            </div>

                            <motion.button
                                type="button"
                                onClick={onToggleAccepted}
                                whileTap={{ scale: 0.98 }}
                                className="flex cursor-pointer w-full items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#181818] p-4 text-right transition-colors hover:border-[#3a3a3a] hover:bg-[#1c1c1c]"
                            >
                                <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                                        acceptedTerms
                                            ? "border-[#1ED760] bg-[#1ED760] text-black"
                                            : "border-zinc-600 bg-transparent text-transparent"
                                    }`}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={acceptedTerms ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </motion.div>
                                </span>

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">
                                        شرایط و قوانین اشتراک پرمیوم اسپاتیفای را مطالعه کرده و می‌پذیرم.
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-400">برای ادامه باید این گزینه فعال شود.</p>
                                </div>
                            </motion.button>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl cursor-pointer border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#242424]"
                                >
                                    بازگشت
                                </button>

                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={!acceptedTerms || loading}
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1ED760] px-4 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(30,215,96,0.18)] transition-all hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                            در حال پردازش
                                        </span>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-5 w-5" />
                                            تأیید و رفتن به پرداخت
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
