"use client";

import { motion } from "framer-motion";
import { Loader2, Music, CheckCircle2 } from "lucide-react";
import type { FormData, PlanType } from "../orderTypes";

interface Props {
    formData: FormData;
    selectedProduct: PlanType | null;
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function PreInvoiceStep({
    formData,
    selectedProduct,
    onBack,
    onSubmit,
    loading,
}: Props) {
    const isFamily = selectedProduct === "family";

    // تبدیل مقادیر جنسیت به فارسی
    const genderMap: Record<string, string> = {
        man: "مرد",
        woman: "زن",
        "non-binary": "غیر باینری",
        "prefer-not-to-say": "ترجیح می‌دهم نگویم",
    };
    const displayGender = formData.gender ? (genderMap[formData.gender] || formData.gender) : "-";

    return (
        <motion.div
            key="pre-invoice-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-[#181818]/80 p-6 md:p-8 rounded-3xl border border-[#282828] space-y-6 w-full backdrop-blur-sm shadow-xl"
        >
            <div className="flex items-center gap-3 border-b border-[#282828] pb-4">
                <div className="p-2 bg-[#1ED760]/10 rounded-full">
                    <Music className="w-5 h-5 text-[#1ED760]" />
                </div>
                <h2 className="text-xl font-bold text-white">پیش‌فاکتور و تایید اطلاعات</h2>
            </div>

            <div className="bg-[#121212] rounded-2xl p-6 space-y-4 border border-[#282828]">
                {/* اطلاعات محصول */}
                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">نوع اشتراک:</span>
                    <span className="text-white font-bold bg-[#282828] px-3 py-1 rounded-lg text-sm md:text-base">
                        {isFamily ? "پریمیوم فمیلی (خانواده)" : "پریمیوم شخصی (Individual)"}
                    </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">مدت زمان:</span>
                    <span className="font-bold text-[#1ED760]">
                        {formData.durationMonths} ماهه
                    </span>
                </div>

                {/* اطلاعات اکانت */}
                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">ایمیل اکانت:</span>
                    <span className="text-white font-medium text-sm md:text-base" dir="ltr">
                        {formData.spotifyEmail}
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">نام (انگلیسی):</span>
                    <span className="text-white font-medium capitalize text-sm md:text-base">
                        {formData.fullNameEn}
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">تاریخ تولد:</span>
                    <span className="text-white font-medium text-sm md:text-base" dir="ltr">
                        {formData.dateOfBirth.replaceAll('-',' - ')}
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">جنسیت:</span>
                    <span className="text-white font-medium text-sm md:text-base">
                        {displayGender}
                    </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[#282828]/50">
                    <span className="text-zinc-400 text-sm">کلمه عبور:</span>
                    <span className="text-white font-medium text-sm md:text-base">
                        {formData.password ? "وارد شده (********)" : "وارد نشده (توسط سایت تنظیم می‌شود)"}
                    </span>
                </div>

                {/* مبلغ نهایی */}
                <div className="pt-4 flex justify-between items-center">
                    <span className="text-zinc-300 font-bold text-lg">مبلغ قابل پرداخت:</span>
                    <div className="text-left flex items-center gap-1.5">
                        <span className="text-2xl md:text-3xl font-black text-[#1ED760]">
                            {formData.price.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-zinc-400 text-sm">تومان</span>
                    </div>
                </div>
            </div>

            {/* دکمه‌های کنترل */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-4 md:px-6 py-4 cursor-pointer rounded-xl bg-[#282828] text-white hover:bg-[#333333] transition-colors font-medium disabled:opacity-50 text-sm md:text-base"
                >
                    اصلاح اطلاعات
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 py-4 cursor-pointer rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-[#1ED760] text-black hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(30,215,96,0.2)] text-sm md:text-base"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-black" />
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            ثبت سفارش و پرداخت
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
