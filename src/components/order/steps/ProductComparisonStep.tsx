"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { PlanType } from "../orderTypes";
import { PRODUCT_META } from "../orderData";
import PlanCard from "../shared/PlanCard";

type Props = {
    selectedProduct: PlanType;
    onSelectProduct: (value: PlanType) => void;
    onNext: () => void;
};

export default function ProductComparisonStep({ selectedProduct, onSelectProduct, onNext }: Props) {
    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
        >
            <h2 className="text-lg font-medium text-slate-200 mb-4">
                تفاوت دو طرح را بررسی کنید و یکی را انتخاب کنید:
            </h2>

            {/* تغییر اصلی در این قسمت انجام شده است */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {(Object.keys(PRODUCT_META) as PlanType[]).map((product) => {
                    const meta = PRODUCT_META[product];
                    return (
                        <PlanCard
                            key={product}
                            id={product}
                            title={meta.title}
                            subtitle={meta.subtitle}
                            description={meta.description}
                            features={meta.features}
                            color={meta.color}
                            bgHover={meta.bgHover}
                            selected={selectedProduct === product}
                            onSelect={onSelectProduct}
                        />
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={!selectedProduct}
                className="w-full cursor-pointer mt-6 py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#1ED760] hover:bg-[#1fdf64]"
            >
                مرحله بعدی <ChevronLeft className="w-5 h-5" />
            </button>
        </motion.div>
    );
}
