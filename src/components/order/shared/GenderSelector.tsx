"use client";

import type { Gender } from "../orderTypes";
import { GENDER_OPTIONS } from "../orderData";

type Props = {
    value: Gender | "";
    onChange: (value: Gender) => void;
    showError: boolean;
};

export default function GenderSelector({ value, onChange, showError }: Props) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                جنسیت <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GENDER_OPTIONS.map((item) => {
                    const active = value === item.value;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onChange(item.value)}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                                active
                                    ? "border-[#1ED760] bg-[#1ED760]/10"
                                    : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
                            }`}
                        >
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                    active ? "border-[#1ED760]" : "border-slate-500"
                                }`}
                            >
                                {active && <span className="h-2.5 w-2.5 rounded-full bg-[#1ED760]" />}
                            </span>
                            <span className={`text-sm ${active ? "text-white" : "text-slate-300"}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {showError && !value && (
                <p className="text-xs mt-2 text-red-400">لطفاً یکی از گزینه‌های جنسیت را انتخاب کنید.</p>
            )}
        </div>
    );
}