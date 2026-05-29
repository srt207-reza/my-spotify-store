"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import type { FormData, PlanType } from "../orderTypes";
import { PRICING } from "../orderData";
import SpotifyTermsModal from "@/components/SpotifyTermsModal";

interface Props {
    formData: FormData;
    selectedProduct: PlanType | null;
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const TERMS_STORAGE_KEY = "spotify_premium_terms_accepted";

export default function PreInvoiceStep({
    formData,
    selectedProduct,
    onBack,
    onSubmit,
    loading,
}: Props) {
    const isFamily = selectedProduct === "family";
    const [showPassword, setShowPassword] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(TERMS_STORAGE_KEY);
            setAcceptedTerms(saved === "true");
        } catch {
            setAcceptedTerms(false);
        }
    }, []);

    const genderMap: Record<string, string> = {
        man: "آقا",
        woman: "خانم",
    };
    const displayGender = formData.gender ? genderMap[formData.gender] || formData.gender : "-";

    const currentPlan = selectedProduct
        ? PRICING[selectedProduct].find((p) => p.durationMonths === formData.durationMonths)
        : undefined;

    const originalPrice = currentPlan?.originalPrice;
    const discountedPrice = currentPlan?.price ?? formData.price;

    const handleOrderClick = () => {
        if (loading) return;

        if (acceptedTerms) {
            onSubmit();
            return;
        }

        setShowConsentModal(true);
    };

    const handleConfirmTerms = () => {
        try {
            localStorage.setItem(TERMS_STORAGE_KEY, "true");
        } catch {
            // ignore storage errors
        }

        setAcceptedTerms(true);
        setShowConsentModal(false);
        onSubmit();
    };

    return (
        <>
            <motion.div
                key="pre-invoice-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl backdrop-blur-sm md:p-8"
            >
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-justify leading-8 sm:p-5">
                    اشتراک پرمیوم بر روی حساب کاربری اسپاتیفای با اطلاعات زیر فعال‌سازی خواهد شد. لطفاً پیش از پرداخت، از
                    صحت اطلاعات واردشده اطمینان حاصل بفرمایید. پس از شروع فرآیند فعال‌سازی اشتراک پرمیوم، امکان لغو سفارش
                    یا تغییر اطلاعات ثبت‌شده وجود نخواهد داشت.
                </div>

                <div className="space-y-4 rounded-2xl border border-[#282828] bg-[#121212] p-6">
                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">طرح اشتراک پرمیوم:</span>
                        <span className="rounded-lg bg-[#282828] px-3 py-1 text-sm font-bold text-white md:text-base">
                            {isFamily ? "پرمیوم فمیلی (خانواده)" : "پرمیوم شخصی (Individual)"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">مدت زمان اشتراک پرمیوم:</span>
                        <span className="font-bold text-[#1ED760]">{formData.durationMonths} ماهه</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">آدرس ایمیل حساب کاربری اسپاتیفای:</span>
                        <span className="text-sm font-medium text-white md:text-base" dir="ltr">
                            {formData.spotifyEmail}
                        </span>
                    </div>

                    {formData.password && (
                        <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                            <span className="text-sm text-zinc-400">کلمه عبور حساب کاربری اسپاتیفای:</span>

                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs text-zinc-300 md:text-sm">
                                    {showPassword ? (
                                        <Unlock className="h-4 w-4 text-[#1ED760]" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-[#1ED760]" />
                                    )}
                                    <span className="font-mono tracking-[0.12em] text-white">
                                        {showPassword ? formData.password : "••••••••"}
                                    </span>
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="shrink-0 rounded-full border border-[#2a2a2a] bg-[#161616] p-2 text-zinc-400 transition-colors hover:border-[#3a3a3a] hover:text-white"
                                    aria-label={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                                    title={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">نام و نام‌خانوادگی:</span>
                        <span className="text-sm font-medium capitalize text-white md:text-base">
                            {formData.fullNameEn}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">تاریخ تولد:</span>
                        <span className="text-sm font-medium text-white md:text-base" dir="ltr">
                            {formData.dateOfBirth.replaceAll("-", " - ")}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                        <span className="text-sm text-zinc-400">جنسیت:</span>
                        <span className="text-sm font-medium text-white md:text-base">{displayGender}</span>
                    </div>

                    {originalPrice && originalPrice > discountedPrice && (
                        <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                            <span className="text-sm text-zinc-400">قیمت اصلی:</span>
                            <span className="text-sm font-medium text-white md:text-base">
                                {originalPrice.toLocaleString("fa-IR")} تومان
                            </span>
                        </div>
                    )}

                    {originalPrice && originalPrice > discountedPrice && (
                        <div className="flex items-center justify-between border-b border-[#282828]/50 pb-3">
                            <span className="text-sm text-zinc-400">قیمت تخفیف خورده:</span>
                            <span className="text-sm font-bold text-[#1ED760] md:text-base">
                                {discountedPrice.toLocaleString("fa-IR")} تومان
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                        <span className="text-lg font-bold text-zinc-300">مبلغ قابل پرداخت:</span>
                        <div className="flex items-center gap-1.5 text-left">
                            <span className="text-2xl font-black text-[#1ED760] md:text-3xl">
                                {formData.price.toLocaleString("fa-IR")}
                            </span>
                            <span className="text-sm text-zinc-400">تومان</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onBack}
                        disabled={loading}
                        className="cursor-pointer rounded-xl bg-[#282828] px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-[#333333] disabled:opacity-50 md:px-6 md:text-base"
                    >
                        ویرایش اطلاعات حساب کاربری اسپاتیفای
                    </button>

                    <button
                        onClick={handleOrderClick}
                        disabled={loading}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1ED760] py-4 text-sm font-bold text-black shadow-[0_0_20px_rgba(30,215,96,0.2)] transition-all hover:scale-[1.02] hover:bg-[#1fdf64] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 md:text-base"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-black" />
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5" />
                                ثبت سفارش و پرداخت
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            <SpotifyTermsModal
                open={showConsentModal}
                acceptedTerms={acceptedTerms}
                onClose={() => setShowConsentModal(false)}
                onToggleAccepted={() => setAcceptedTerms((prev) => !prev)}
                onConfirm={handleConfirmTerms}
                loading={loading}
                rulesHref="/terms"
            />
        </>
    );
}