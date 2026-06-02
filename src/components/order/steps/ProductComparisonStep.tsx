"use client";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { PlanType } from "../orderTypes";
import { PRODUCT_META } from "../orderData";
import PlanCard from "../shared/PlanCard";

type Props = {
    selectedProduct: PlanType | null;
    onSelectProduct: (value: PlanType) => void;
    onNext: () => void;
    onBack: () => void;
};

export default function ProductComparisonStep({ selectedProduct, onSelectProduct, onNext, onBack }: Props) {
    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
        >
             <h2 className="text-lg font-medium text-slate-200 mb-8">
                لطفاً با توجه به مشخصات طرح‌های موجود، طرح مورد نظر را انتخاب نمایید و سپس بر روی گزینه{" "}
                <strong className="text-[#1ED760]">تأیید طرح اشتراک پرمیوم</strong>، کلیک بفرمایید.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {(Object.keys(PRODUCT_META) as PlanType[]).map((product) => {
                    const meta = PRODUCT_META[product];

                    return (
                        <div key={product} className="flex flex-col h-full gap-4">
                            <div className="flex-1 flex flex-col [&>div]:h-full">
                                <PlanCard
                                    id={product}
                                    title={meta.title}
                                    subtitle={meta.subtitle}
                                    description={meta.description}
                                    features={meta.features}
                                    color={meta.color}
                                    bgHover={meta.bgHover}
                                    selected={selectedProduct === product}
                                    onSelect={() => onSelectProduct(product)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 md:flex-row mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 sm:w-auto"
                >
                    بازگشت
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!selectedProduct}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1ED760] py-4 font-bold text-black transition-all hover:bg-[#1fdf64] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    تأیید طرح اشتراک پرمیوم
                    <ChevronLeft className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
}
