"use client";

import { useMemo, useState } from "react";
import {
    BadgePercent,
    CheckCircle2,
    CircleDollarSign,
    Loader2,
    RotateCcw,
    Save,
    User,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import type { PlanPricing } from "@/components/order/orderData";
import type { PlanType } from "@/components/order/orderTypes";

type Props = {
    initialPricing: PlanPricing;
    adminSecret: string;
};

const PLAN_GROUPS: Array<{
    type: PlanType;
    title: string;
    description: string;
    icon: typeof User;
}> = [
    {
        type: "individual",
        title: "پلن‌های شخصی",
        description: "قیمت بسته‌های Individual",
        icon: User,
    },
    {
        type: "family",
        title: "پلن‌های فمیلی",
        description: "قیمت بسته‌های Family",
        icon: Users,
    },
];

function clonePricing(pricing: PlanPricing): PlanPricing {
    return {
        individual: pricing.individual.map((plan) => ({ ...plan })),
        family: pricing.family.map((plan) => ({ ...plan })),
    };
}

function formatPrice(value: number) {
    return Number.isFinite(value) ? value.toLocaleString("fa-IR") : "۰";
}

export default function PlanPricingManager({ initialPricing, adminSecret }: Props) {
    const [savedPricing, setSavedPricing] = useState<PlanPricing>(() => clonePricing(initialPricing));
    const [draftPricing, setDraftPricing] = useState<PlanPricing>(() => clonePricing(initialPricing));
    const [saving, setSaving] = useState(false);

    const isDirty = useMemo(
        () => JSON.stringify(savedPricing) !== JSON.stringify(draftPricing),
        [draftPricing, savedPricing],
    );

    const hasInvalidPrice = useMemo(
        () =>
            ([...draftPricing.individual, ...draftPricing.family]).some((plan) => {
                const originalPrice = plan.originalPrice ?? 0;
                return !Number.isInteger(plan.price) || plan.price <= 0 || !Number.isInteger(originalPrice) || originalPrice < plan.price;
            }),
        [draftPricing],
    );

    const updatePrice = (
        planType: PlanType,
        planId: string,
        field: "price" | "originalPrice",
        value: string,
    ) => {
        const parsedValue = value === "" ? 0 : Number(value);

        setDraftPricing((current) => ({
            ...current,
            [planType]: current[planType].map((plan) =>
                plan.id === planId
                    ? {
                          ...plan,
                          [field]: Number.isFinite(parsedValue) ? Math.max(0, Math.trunc(parsedValue)) : 0,
                      }
                    : plan,
            ),
        }));
    };

    const resetChanges = () => {
        setDraftPricing(clonePricing(savedPricing));
    };

    const savePricing = async () => {
        if (hasInvalidPrice) {
            toast.error("قیمت قبل تخفیف باید مساوی یا بیشتر از قیمت نهایی باشد.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/plan-prices", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-secret": adminSecret,
                },
                body: JSON.stringify({ pricing: draftPricing }),
            });
            const data = await res.json();

            if (!res.ok || !data.success || !data.pricing) {
                toast.error(data.message || "خطا در ذخیره قیمت پلن‌ها.");
                return;
            }

            const nextPricing = clonePricing(data.pricing as PlanPricing);
            setSavedPricing(nextPricing);
            setDraftPricing(clonePricing(nextPricing));
            toast.success("قیمت پلن‌ها بروزرسانی شد.");
        } catch {
            toast.error("ارتباط با سرور برقرار نشد.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101311]" aria-labelledby="pricing-title">
            <div className="flex flex-col gap-5 border-b border-white/10 bg-gradient-to-l from-emerald-500/[0.08] via-transparent to-transparent p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                        <CircleDollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 id="pricing-title" className="text-lg font-black text-white sm:text-xl">
                            مدیریت قیمت پلن‌ها
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                            قیمت قبل تخفیف و مبلغ نهایی قابل پرداخت را برای تمام پلن‌های شخصی و فمیلی تعیین کنید.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                    <button
                        type="button"
                        onClick={resetChanges}
                        disabled={!isDirty || saving}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-300 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <RotateCcw className="h-4 w-4" />
                        لغو تغییرات
                    </button>
                    <button
                        type="button"
                        onClick={savePricing}
                        disabled={!isDirty || hasInvalidPrice || saving}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-black text-black transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101311] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "در حال ذخیره" : "ذخیره همه قیمت‌ها"}
                    </button>
                </div>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
                {PLAN_GROUPS.map(({ type, title, description, icon: GroupIcon }) => (
                    <div key={type} className="rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-emerald-400">
                                <GroupIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-white">{title}</h3>
                                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                            {draftPricing[type].map((plan) => {
                                const originalPrice = plan.originalPrice ?? 0;
                                const savings = Math.max(0, originalPrice - plan.price);
                                const discountPercent = originalPrice > 0
                                    ? Math.round((savings / originalPrice) * 100)
                                    : 0;
                                const invalid = plan.price <= 0 || originalPrice < plan.price;

                                return (
                                    <article
                                        key={plan.id}
                                        className={`rounded-2xl border p-4 transition-colors ${
                                            invalid
                                                ? "border-rose-500/40 bg-rose-500/[0.05]"
                                                : "border-white/8 bg-[#151816] hover:border-white/15"
                                        }`}
                                    >
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-black text-white">{plan.title}</h4>
                                                    {plan.disabled && (
                                                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                                                            ناموجود در سایت
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500" dir="ltr">
                                                    {plan.id}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-xs font-bold text-emerald-300">
                                                {discountPercent > 0 ? (
                                                    <>
                                                        <BadgePercent className="h-3.5 w-3.5" />
                                                        {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        بدون تخفیف
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <label className="block">
                                                <span className="mb-2 block text-xs font-bold text-slate-400">
                                                    قیمت قبل تخفیف
                                                </span>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min="1"
                                                        step="1000"
                                                        value={originalPrice || ""}
                                                        onChange={(event) =>
                                                            updatePrice(type, plan.id, "originalPrice", event.target.value)
                                                        }
                                                        className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-3 pl-14 text-left text-sm font-bold text-white transition-colors placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/10"
                                                        dir="ltr"
                                                        aria-invalid={invalid}
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] text-slate-500">
                                                        تومان
                                                    </span>
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="mb-2 block text-xs font-bold text-slate-400">
                                                    قیمت نهایی
                                                </span>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min="1"
                                                        step="1000"
                                                        value={plan.price || ""}
                                                        onChange={(event) =>
                                                            updatePrice(type, plan.id, "price", event.target.value)
                                                        }
                                                        className="h-12 w-full rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-3 pl-14 text-left text-sm font-black text-emerald-300 transition-colors focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/10"
                                                        dir="ltr"
                                                        aria-invalid={invalid}
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] text-emerald-500/70">
                                                        تومان
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs">
                                            <span className={invalid ? "font-bold text-rose-400" : "text-slate-500"}>
                                                {invalid
                                                    ? "قیمت قبل تخفیف نباید کمتر از قیمت نهایی باشد."
                                                    : `صرفه‌جویی کاربر: ${formatPrice(savings)} تومان`}
                                            </span>
                                            <span className="font-bold text-white">
                                                مبلغ فروش: {formatPrice(plan.price)} تومان
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
