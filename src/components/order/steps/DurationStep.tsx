"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import type { FormData, PlanType } from "../orderTypes";
import { PRICING } from "../orderData";

type Props = {
    selectedProduct: PlanType;
    formData: FormData;
    onSelectPlan: (planId: string) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function DurationStep({
    selectedProduct,
    formData,
    onSelectPlan,
    onBack,
    onNext,
}: Props) {
    const isFamily = selectedProduct === "family";
    const themeColor = "text-[#1ED760]";

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-5"
        >
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">طرح انتخاب‌شده</p>
                <p className="text-white font-bold mt-1">
                    {isFamily ? "اسپاتیفای فمیلی (Family)" : "اسپاتیفای شخصی (Individual)"}
                </p>
            </div>

            {isFamily && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex gap-3 text-sm leading-relaxed">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                        طبق قوانین اسپاتیفای، هر اکانت در سال تنها <strong>دو بار</strong> می‌تواند عضو فمیلی شود.
                        لطفاً قبل از خرید این مورد را در نظر داشته باشید.
                    </p>
                </div>
            )}

            <h2 className="text-lg font-medium text-slate-200 mb-2">مدت زمان طرح را انتخاب کنید:</h2>

            <div className="space-y-4">
                {PRICING[selectedProduct].map((plan, index) => {
                    const isSelected = formData.planId === plan.id;
                    const activeBorder = "border-[#1ED760] shadow-[0_0_20px_rgba(30,215,96,0.15)]";
                    const activeBg = "bg-[#1ED760]/10";

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectPlan(plan.id)}
                            className={`relative p-5 pl-16 rounded-2xl border-2 cursor-pointer transition-colors duration-300 overflow-hidden ${
                                isSelected
                                    ? `${activeBorder} ${activeBg}`
                                    : "border-slate-700 bg-slate-800/40 hover:bg-slate-800/60 hover:border-slate-500"
                            }`}
                        >
                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{plan.title}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{plan.desc}</p>
                                </div>

                                <div className="text-left flex flex-col items-end justify-center min-w-[120px]">
                                    <div className="flex items-baseline gap-1.5">
                                        <span
                                            className={`text-2xl font-black transition-colors duration-300 ${
                                                isSelected ? themeColor : "text-white"
                                            }`}
                                        >
                                            {plan.price.toLocaleString("fa-IR")}
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                isSelected ? "text-[#1ED760]/80" : "text-slate-500"
                                            }`}
                                        >
                                            تومان
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        className="absolute top-1/2 -translate-y-1/2 left-5 z-20"
                                    >
                                        <div className="bg-slate-900/50 rounded-full p-1 backdrop-blur-sm">
                                            <CheckCircle2
                                                className="w-7 h-7 text-[#1ED760] drop-shadow-lg"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onBack}
                    className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    بازگشت
                </button>
                <button
                    onClick={onNext}
                    disabled={!formData.planId}
                    className="flex-1 cursor-pointer py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#1ED760] hover:bg-[#1fdf64]"
                >
                    مرحله بعدی <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}