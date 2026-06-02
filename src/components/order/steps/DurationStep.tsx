"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CheckCircle2, BadgePercent } from "lucide-react";
import type { FormData, PlanType } from "../orderTypes";
import { PRICING } from "../orderData";
import { cn } from "@/lib/utils";

type Props = {
    selectedProduct: PlanType;
    formData: FormData;
    onSelectPlan: (planId: string) => void;
    onBack: () => void;
    onNext: () => void;
};

function calcDiscountPercent(original: number, price: number): number {
    return Math.round(((original - price) / original) * 100);
}

function calcSavings(original: number, price: number): number {
    return original - price;
}

export default function DurationStep({ selectedProduct, formData, onSelectPlan, onBack, onNext }: Props) {
    const isFamily = selectedProduct === "family";

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5 rounded-[28px] border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20 sm:p-6"
        >
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 leading-8 text-justify sm:p-5">
                {isFamily ? (
                    <>
                        طرح‌ گروهی (Family) اسپاتیفای تنها در بسته‌های زمانی بلندمدت ارائه می‌گردد، لطفاً مدت زمان مورد
                        نظر را انتخاب نمایید و سپس بر روی گزینه{" "}
                        <strong className="text-[#1ED760]">تأیید مدت زمان اشتراک پرمیوم</strong>، کلیک بفرمایید.
                    </>
                ) : (
                    <>
                        طرح‌ {isFamily ? "گروهی" : "شخصی"} اسپاتیفای در بسته‌های زمانی متنوع ارائه می‌گردد، لطفاً مدت
                        زمان مورد نظر را انتخاب نمایید و سپس بر روی گزینه{" "}
                        <strong className="text-[#1ED760]">تأیید مدت زمان اشتراک پرمیوم</strong>، کلیک بفرمایید.
                    </>
                )}
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">مدت زمان طرح را انتخاب کنید:</h2>
            </div>

            <div className="mx-auto grid w-full gap-3">
                {PRICING[selectedProduct].map((plan, index) => {
                    const isSelected = formData.planId === plan.id;
                    const isDisabled = plan.disabled === true;
                    const hasDiscount = plan.originalPrice != null && plan.originalPrice > plan.price;
                    const discountPercent = hasDiscount ? calcDiscountPercent(plan.originalPrice!, plan.price) : 0;
                    const savings = hasDiscount ? calcSavings(plan.originalPrice!, plan.price) : 0;

                    return (
                        <motion.button
                            key={plan.id}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
                            whileHover={isDisabled ? {} : { y: -1 }}
                            whileTap={isDisabled ? {} : { scale: 0.992 }}
                            onClick={() => {
                                if (!isDisabled) onSelectPlan(plan.id);
                            }}
                            className={[
                                "group relative w-full overflow-hidden rounded-2xl border text-right text-inherit transition-all duration-200",
                                "p-4 sm:p-5",
                                "flex flex-col lg:!items-center  gap-4",
                                "sm:flex-row sm:items-start sm:justify-between sm:gap-5",
                                isDisabled
                                    ? "cursor-not-allowed !py-6 border-zinc-800/70 bg-black/35 opacity-55"
                                    : isSelected
                                      ? "border-[#1ED760]/60 bg-[#1ED760]/8 shadow-[0_0_0_1px_rgba(30,215,96,0.12)]"
                                      : "cursor-pointer border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900/80",
                            ].join(" ")}
                        >
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

                            <div className="relative z-10 min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3
                                                className={[
                                                    "min-w-0 text-base font-extrabold tracking-tight sm:text-[17px]",
                                                    isDisabled ? "text-zinc-500" : "text-zinc-100",
                                                ].join(" ")}
                                            >
                                                {plan.title}
                                            </h3>

                                            {isDisabled && (
                                                <span
                                                    className={cn(
                                                        "shrink-0 inline-flex items-center gap-2 rounded-full",
                                                        "border border-red-500/30 bg-red-500/10",
                                                        "px-2.5 py-0.5 text-[11px] font-semibold text-red-200",
                                                        "shadow-[0_0_0_0_rgba(239,68,68,0)] transition-all duration-300",
                                                        "motion-safe:animate-[unavailablePulse_1.6s_ease-in-out_infinite]",
                                                        "hover:-translate-y-[1px] hover:border-red-500/45",
                                                        "hover:bg-red-500/15 hover:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]",
                                                    )}
                                                >
                                                    <span className="h-2 w-2 rounded-full bg-red-400 motion-safe:animate-pulse" />
                                                    ناموجود
                                                </span>
                                            )}
                                        </div>

                                        {hasDiscount && (
                                            <div
                                                className={`mt-3 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium leading-5 ${isDisabled ? "border-gray-500/20 bg-gray-500/10 text-gray-300/70" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"}`}
                                            >
                                                <BadgePercent className="h-3.5 w-3.5 shrink-0" />
                                                <span className="whitespace-normal">{discountPercent}٪ تخفیف</span>
                                                <span
                                                    className={
                                                        isDisabled ? '"text-gray-300/70"' : '"text-emerald-300/70"'
                                                    }
                                                >
                                                    •
                                                </span>
                                                <span className="whitespace-normal">
                                                    {savings.toLocaleString("fa-IR")} تومان سود شما
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile indicator: داخل جریان، بدون افتادن روی متن */}
                                    {isSelected && !isDisabled && (
                                        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1ED760]/20 bg-black/70 md:hidden">
                                            <CheckCircle2 className="h-5 w-5 text-[#1ED760]" strokeWidth={2.5} />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 flex shrink-0 flex-col items-end justify-end gap-2 text-left">
                                {plan.originalPrice && plan.originalPrice > plan.price && (
                                    <div
                                        className={`flex items-center justify-end gap-1.5 text-md ${isDisabled ? "text-zinc-700" : "text-zinc-500"}`}
                                    >
                                        <span className="line-through">
                                            {plan.originalPrice.toLocaleString("fa-IR")}
                                        </span>
                                        <span>تومان</span>
                                    </div>
                                )}

                                <div className="flex items-end justify-end gap-1">
                                    <span
                                        className={`${!isDisabled && !plan?.originalPrice ? "mt-2" : ""} text-2xl font-black leading-none tracking-tight transition-all duration-200 sm:text-[28px] ${
                                            isDisabled
                                                ? "text-zinc-600 mt-2"
                                                : isSelected
                                                  ? "md:ml-2 mt-2 text-[#1ED760]"
                                                  : "text-zinc-100 mt-2"
                                        }`}
                                    >
                                        {plan.price.toLocaleString("fa-IR")}
                                    </span>
                                    <span
                                        className={[
                                            "pb-1 text-sm font-medium transition-opacity duration-200",
                                            isSelected
                                                ? "md:opacity-0"
                                                : isDisabled
                                                  ? "text-zinc-700"
                                                  : "text-zinc-500",
                                        ].join(" ")}
                                    >
                                        تومان
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isSelected && !isDisabled && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0, rotate: -30 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        exit={{ scale: 0, opacity: 0, rotate: 20 }}
                                        transition={{ type: "spring", stiffness: 420, damping: 24 }}
                                        className={[
                                            "hidden z-20 md:block md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2",
                                            plan.originalPrice ? "md:mt-4" : "",
                                        ].join(" ")}
                                    >
                                        <div className="rounded-full border border-[#1ED760]/20 bg-black/70 p-1.5">
                                            <CheckCircle2 className="h-6 w-6 text-[#1ED760]" strokeWidth={2.5} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                    onClick={onBack}
                    className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 sm:w-auto"
                >
                    بازگشت
                </button>
                <button
                    onClick={onNext}
                    disabled={!formData.planId}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1ED760] py-4 font-bold text-black transition-all hover:bg-[#1fdf64] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    تأیید مدت زمان اشتراک پرمیوم <ChevronLeft className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
}
