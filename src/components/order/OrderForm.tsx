"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

import type { FormData, Plan, PlanType, TouchedState } from "./orderTypes";
import { PRICING } from "./orderData";
import { getAge, isPasswordValid, NAME_REGEX, EMAIL_REGEX } from "@/lib/orderValidation";

import StepIndicator from "./shared/StepIndicator";
import ProductComparisonStep from "./steps/ProductComparisonStep";
import DurationStep from "./steps/DurationStep";
import UserInfoStep from "./steps/UserInfoStep";
import PaymentStep from "./steps/PaymentStep";
import PreInvoiceStep from "./steps/PreInvoiceStep";

const initialTouchedState: TouchedState = {
    fullNameEn: false,
    spotifyEmail: false,
    dateOfBirth: false,
    password: false,
    gender: false,
};

type ReceiptPayload = {
    receiptNumber?: string;
    payerName?: string;
    depositTime?: string;
    bankName?: string;
    receiptImage?: string | null;
    note?: string;
};

type DiscountType = "percent" | "fixed";

type DiscountCode = {
    code: string;
    type: DiscountType;
    value: number;
    active: boolean;
    maxUses?: number;
    usedCount: number;
    minOrderAmount?: number;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
};

function normalizeCouponCode(value: string) {
    return value.trim().replace(/\s+/g, "").toUpperCase();
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const d = new Date(expiresAt);
    return Number.isNaN(d.getTime()) ? false : d.getTime() < Date.now();
}

function calculateDiscount(price: number, code: DiscountCode) {
    let discountAmount = 0;

    if (code.type === "percent") {
        discountAmount = Math.floor((price * code.value) / 100);
    } else {
        discountAmount = Math.floor(code.value);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, price));

    return {
        discountAmount,
        finalPrice: Math.max(0, price - discountAmount),
    };
}

export default function OrderForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const getInitialProduct = (): PlanType | null => {
        const productParam = searchParams.get("product");
        if (productParam === "family" || productParam === "individual") {
            return productParam;
        }
        return null;
    };

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [supportLink] = useState("https://t.me/getSpotify_Support");

    const [selectedProduct, setSelectedProduct] = useState<PlanType | null>(getInitialProduct());
    const [submittedStep3, setSubmittedStep3] = useState(false);
    const [touched, setTouched] = useState<TouchedState>(initialTouchedState);

    const [couponCode, setCouponCode] = useState("");
    const [payablePrice, setPayablePrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponApplying, setCouponApplying] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        planType: getInitialProduct() || "individual",
        durationMonths: 0,
        planId: "",
        planTitle: "",
        price: 0,
        fullNameEn: "",
        spotifyEmail: "",
        dateOfBirth: "",
        password: "",
        gender: "",
    });

    useEffect(() => {
        const productParam = searchParams.get("product");
        const currentProduct = productParam === "family" || productParam === "individual" ? productParam : null;
        const currentPlanParam = searchParams.get("plan");

        setSelectedProduct(currentProduct);
        setCouponCode("");
        setDiscountAmount(0);
        setPayablePrice(0);

        let matchedPlan: Plan | undefined;

        if (currentProduct && currentPlanParam) {
            const requestedMonths = parseInt(currentPlanParam.replace(/[^0-9]/g, ""), 10);
            if (!Number.isNaN(requestedMonths)) {
                matchedPlan = PRICING[currentProduct].find((p) => p.durationMonths === requestedMonths);
            }
        }

        if (matchedPlan && currentProduct) {
            setFormData((prev) => ({
                ...prev,
                planType: currentProduct,
                planId: matchedPlan!.id,
                durationMonths: matchedPlan!.durationMonths,
                planTitle: matchedPlan!.title,
                price: matchedPlan!.price,
            }));
            setPayablePrice(matchedPlan.price);
        } else {
            setFormData((prev) => ({
                ...prev,
                planType: currentProduct || "individual",
                planId: "",
                durationMonths: 0,
                planTitle: "",
                price: 0,
            }));
        }

        setStep(1);
        setOrderId("");
        setSubmittedStep3(false);
        setTouched(initialTouchedState);
    }, [searchParams]);

    const fullNameValid = NAME_REGEX.test(formData.fullNameEn.trim());
    const emailValid = EMAIL_REGEX.test(formData.spotifyEmail.trim());
    const age = getAge(formData.dateOfBirth);
    const ageValid = age !== null && age >= 15;
    const passwordValid = isPasswordValid(formData.password);
    const genderValid = Boolean(formData.gender);

    const canSubmit =
        fullNameValid && emailValid && ageValid && passwordValid && genderValid && formData.planId && selectedProduct;

    const handlePlanSelect = (planId: string) => {
        if (!selectedProduct) return;

        const plan = PRICING[selectedProduct].find((p) => p.id === planId);
        if (!plan) return;

        setFormData((prev) => ({
            ...prev,
            planId: plan.id,
            durationMonths: plan.durationMonths,
            planTitle: plan.title,
            price: plan.price,
        }));

        setCouponCode("");
        setDiscountAmount(0);
        setPayablePrice(plan.price);
    };

    const resetPlanSelection = () => {
        setSelectedProduct(null);
        setCouponCode("");
        setDiscountAmount(0);
        setPayablePrice(0);

        setFormData((prev) => ({
            ...prev,
            planType: "individual",
            durationMonths: 0,
            planId: "",
            planTitle: "",
            price: 0,
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("شماره کارت کپی شد!");
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("کد تخفیف را وارد کنید.");
            return;
        }

        if (!formData.price || formData.price <= 0) {
            toast.error("ابتدا یک پلن را انتخاب کنید.");
            return;
        }

        setCouponApplying(true);
        try {
            const normalizedCode = normalizeCouponCode(couponCode);

            const res = await fetch("/api/discount-code");
            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در بررسی کد تخفیف");
                return;
            }

            const codes: DiscountCode[] = Array.isArray(data.codes) ? data.codes : [];
            const matched = codes.find((item) => item.code.toUpperCase() === normalizedCode);

            if (!matched) {
                setDiscountAmount(0);
                setPayablePrice(formData.price);
                toast.error("کد تخفیف معتبر نیست.");
                return;
            }

            if (!matched.active) {
                setDiscountAmount(0);
                setPayablePrice(formData.price);
                toast.error("این کد تخفیف غیرفعال است.");
                return;
            }

            if (isExpired(matched.expiresAt)) {
                setDiscountAmount(0);
                setPayablePrice(formData.price);
                toast.error("این کد تخفیف منقضی شده است.");
                return;
            }

            if (typeof matched.maxUses === "number" && matched.usedCount >= matched.maxUses) {
                setDiscountAmount(0);
                setPayablePrice(formData.price);
                toast.error("این کد تخفیف دیگر قابل استفاده نیست.");
                return;
            }

            if (typeof matched.minOrderAmount === "number" && formData.price < matched.minOrderAmount) {
                setDiscountAmount(0);
                setPayablePrice(formData.price);
                toast.error("مبلغ سفارش برای این کد تخفیف کافی نیست.");
                return;
            }

            const result = calculateDiscount(formData.price, matched);
            setCouponCode(normalizedCode);
            setDiscountAmount(result.discountAmount);
            setPayablePrice(result.finalPrice);

            toast.success("کد تخفیف اعمال شد.");
        } catch {
            toast.error("ارتباط با سرور برقرار نشد.");
        } finally {
            setCouponApplying(false);
        }
    };

    const handleCreateOrder = async (receiptData?: ReceiptPayload) => {
        if (!canSubmit) {
            toast.error("لطفاً همه اطلاعات را با فرمت درست تکمیل کنید.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planType: selectedProduct,
                    durationMonths: formData.durationMonths,
                    spotifyEmail: formData.spotifyEmail.trim(),
                    fullNameEn: formData.fullNameEn.trim(),
                    dateOfBirth: formData.dateOfBirth,
                    password: formData.password || "",
                    gender: formData.gender,
                    price: formData.price,
                    couponCode: couponCode.trim(),
                    receipt: receiptData || null,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                toast.success("سفارش ثبت شد.");
            } else {
                toast.error(data.message || "خطایی در ثبت سفارش رخ داد.");
            }
        } catch {
            toast.error("ارتباط با سرور برقرار نشد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
                {step <= 5 && !orderId && (
                    <StepIndicator
                        step={step}
                        onStepOneClick={() => {
                            resetPlanSelection();
                            setOrderId("");
                            setStep(1);
                        }}
                    />
                )}

                {step !== 5 && (
                    <>
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 mt-6 mb-4">
                            {step === 2 ? (
                                <Image src="/assets/images/clock.png" alt="step2" width={32} height={32} />
                            ) : step === 3 ? (
                                <Image src="/assets/images/user.png" alt="step3" width={32} height={32} />
                            ) : step === 4 ? (
                                <Image src="/assets/images/approved.png" alt="step4" width={32} height={32} />
                            ) : (
                                <User className="w-8 h-8 text-[#1ED760]" />
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-white">
                            {step === 1
                                ? "انتخاب طرح اشتراک پرمیوم"
                                : step === 2
                                  ? "انتخاب مدت زمان اشتراک پرمیوم"
                                  : step === 3
                                    ? "وارد نمودن اطلاعات حساب کاربری اسپاتیفای"
                                    : step === 4
                                      ? "تأیید اطلاعات حساب کاربری اسپاتیفای"
                                      : "ورود اطلاعات"}
                        </h1>
                    </>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <ProductComparisonStep
                        selectedProduct={selectedProduct}
                        onSelectProduct={(value) => {
                            setSelectedProduct(value);
                            setFormData((prev) => ({ ...prev, planType: value }));
                            setCouponCode("");
                            setDiscountAmount(0);
                            setPayablePrice(0);
                        }}
                        onBack={() => {
                            router.push("/");
                        }}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <DurationStep
                        selectedProduct={selectedProduct}
                        formData={formData}
                        onSelectPlan={handlePlanSelect}
                        onBack={() => {
                            resetPlanSelection();
                            setStep(1);
                        }}
                        onNext={() => setStep(3)}
                    />
                )}

                {step === 3 && (
                    <UserInfoStep
                        formData={formData}
                        setFormData={setFormData}
                        touched={touched}
                        setTouched={setTouched}
                        submittedStep3={submittedStep3}
                        setSubmittedStep3={setSubmittedStep3}
                        onBack={() => setStep(2)}
                        onSubmit={() => setStep(4)}
                        loading={false}
                    />
                )}

                {step === 4 && (
                    <PreInvoiceStep
                        formData={formData}
                        selectedProduct={selectedProduct}
                        couponCode={couponCode}
                        discountAmount={discountAmount}
                        payablePrice={payablePrice || formData.price}
                        couponApplying={couponApplying}
                        setCouponCode={setCouponCode}
                        onApplyCoupon={handleApplyCoupon}
                        onBack={() => setStep(3)}
                        loading={loading}
                        onNext={() => setStep(5)}
                    />
                )}

                {step === 5 && (
                    <PaymentStep
                        orderId={orderId}
                        price={payablePrice || formData.price}
                        onCopyCard={() => copyToClipboard("5041721212076674")}
                        onCopySheba={() => copyToClipboard("IR950700010001110988147001")}
                        onBack={() => {
                            setOrderId("");
                            setStep(4);
                        }}
                        onConfirmReceipt={handleCreateOrder}
                        loading={loading}
                        supportLink={supportLink}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}