"use client";

import { motion } from "framer-motion";
import { CheckCircle2, User, Users } from "lucide-react";
import Link from "next/link";
import type { PlanType } from "../orderTypes";

type Props = {
    id: PlanType;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    color: string;
    bgHover: string;
    selected: boolean;
    onSelect: (value: PlanType) => void;
};

export default function PlanCard({
    id,
    title,
    subtitle,
    description,
    features,
    color,
    bgHover,
    selected,
    onSelect,
}: Props) {
    const isGroupPlan = id.toLowerCase().includes('group') || id.toLowerCase().includes('family');
    const planName = isGroupPlan ? "طرح گروهی" : "طرح شخصی";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`group relative flex flex-col bg-store-panel rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                selected ? "border-[#1ED760] shadow-[0_0_20px_rgba(30,215,96,0.15)]" : "border-store-border"
            } ${bgHover} h-full`}
            onClick={() => onSelect(id)}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col flex-1 h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                        {id === "individual" ? (
                            <User className="w-12 h-12 text-green-400" />
                        ) : (
                            <Users className="w-12 h-12 text-emerald-400" />
                        )}
                    </div>

                    {/* تغییرات جدید در این بخش اعمال شده است */}
                    {selected ? (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -30 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 420, damping: 24 }}
                            className="rounded-full border border-[#1ED760]/20 bg-black/70 p-1.5"
                        >
                            <CheckCircle2 className="h-6 w-6 text-[#1ED760]" strokeWidth={2.5} />
                        </motion.div>
                    ) : null}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <h3 className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${color} mb-4`}>
                    {subtitle}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 text-justify">{description}</p>

                <ul className="space-y-3 mb-8 mt-auto">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1ED760]" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="pt-6 border-t border-slate-700/50 text-justify text-[11px] md:text-xs text-zinc-400 leading-loose">
                    جهت مشاهده کامل قوانین اشتراک پرمیوم {planName}،{" "}
                    <Link 
                        href="/terms" 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-[#1ED760] font-medium hover:text-[#1fdf64] transition-colors"
                    >
                        صفحه قوانین و مقررات
                    </Link>{" "}
                    را مشاهده بفرمایید.
                    <span className="block mt-1">
                        همچنین در صورت وجود هرگونه پرسش یا ابهام، با کارشناسان بخش پشتیبانی در ارتباط باشید.
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
