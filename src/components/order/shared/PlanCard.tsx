"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, User, Users } from "lucide-react";
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`group relative bg-store-panel rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                selected ? "border-[#1ED760] shadow-[0_0_20px_rgba(30,215,96,0.15)]" : "border-store-border"
            } ${bgHover}`}
            onClick={() => onSelect(id)}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
            />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                        {id === "individual" ? (
                            <User className="w-12 h-12 text-green-400" />
                        ) : (
                            <Users className="w-12 h-12 text-emerald-400" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                        {selected ? "انتخاب شده" : "برای انتخاب روی کارت بزنید"}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <h3
                    className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${color} mb-4`}
                >
                    {subtitle}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 min-h-16">{description}</p>

                <ul className="space-y-3">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1ED760]" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
