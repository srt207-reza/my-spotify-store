"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Loader2, Users, User } from "lucide-react";
import toast from "react-hot-toast";

import type { FormData, Plan, PlanType, TouchedState } from "./orderTypes";
import { PRICING } from "./orderData";
import { getAge, isPasswordValid, NAME_REGEX, EMAIL_REGEX } from "@/lib/orderValidation";

import StepIndicator from "./shared/StepIndicator";
import ProductComparisonStep from "./steps/ProductComparisonStep";
import DurationStep from "./steps/DurationStep";
import UserInfoStep from "./steps/UserInfoStep";
import PaymentStep from "./steps/PaymentStep";
import BirthDatePicker from "@/components/BirthDatePicker";
import PreInvoiceStep from "./steps/PreInvoiceStep";

const initialTouchedState: TouchedState = {
    fullNameEn: false,
    spotifyEmail: false,
    dateOfBirth: false,
    password: false,
    gender: false,
};

export default function OrderForm() {
    const searchParams = useSearchParams();

    // مقدار پیش‌فرض را در صورت نبود پارامتر روی null تنظیم می‌کنیم
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
    const [supportLink, setSupportLink] = useState("https://t.me/getSpotify_Support");

    // استیت مربوط به محصول می‌تواند null باشد
    const [selectedProduct, setSelectedProduct] = useState<PlanType | null>(getInitialProduct());

    const [submittedStep3, setSubmittedStep3] = useState(false);
    const [touched, setTouched] = useState<TouchedState>(initialTouchedState);

    const [formData, setFormData] = useState<FormData>({
        planType: getInitialProduct() || "individual", // مقدار پیش‌فرض اولیه برای فرم
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
        setSubmittedStep3(false);
        setTouched(initialTouchedState);
    }, [searchParams]);

    const isFamily = selectedProduct === "family";

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
    };

    const handleSubmit = async () => {
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
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                if (data.supportLink) setSupportLink(data.supportLink);
                setStep(5);
                toast.success("سفارش شما با موفقیت ثبت شد!");
            } else {
                toast.error(data.message || "خطایی در ثبت سفارش رخ داد.");
            }
        } catch {
            toast.error("ارتباط با سرور برقرار نشد.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("شماره کارت کپی شد!");
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8">
                {step !== 5 && (
                    <>
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                            {isFamily ? (
                                <Users className="w-8 h-8 text-[#1ED760]" />
                            ) : (
                                <User className="w-8 h-8 text-[#1ED760]" />
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            {step === 1 ? "تفاوت طرح فمیلی و شخصی" : step === 2 ? "مدت زمان طرح ها" : "ورود اطلاعات"}
                        </h1>
                    </>
                )}

                {step < 5 && <StepIndicator step={step} onStepOneClick={() => setStep(1)} />}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <ProductComparisonStep
                        selectedProduct={selectedProduct}
                        onSelectProduct={(value) => {
                            setSelectedProduct(value);
                            setFormData((prev) => ({ ...prev, planType: value }));
                        }}
                        onNext={() => setStep(2)}
                    />
                )}

                {/* نکته: اگر در استپ ۲ (DurationStep) دکمه 'بعدی' برای موبایل ندارید، باید در فایل DurationStep آن را مانند استپ ۱ اضافه کنید */}
                {step === 2 && (
                    <DurationStep
                        selectedProduct={selectedProduct}
                        formData={formData}
                        onSelectPlan={handlePlanSelect}
                        onBack={() => setStep(1)}
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
                        onSubmit={() => setStep(4)} // رفتن به مرحله پیش‌فاکتور
                        loading={false}
                    />
                )}

                {step === 4 && (
                    <PreInvoiceStep
                        formData={formData}
                        selectedProduct={selectedProduct}
                        onBack={() => setStep(3)}
                        onSubmit={handleSubmit} // در اینجا فراخوانی API انجام می‌شود
                        loading={loading}
                    />
                )}

                {step === 5 && (
                    <PaymentStep
                        orderId={orderId}
                        price={formData.price}
                        supportLink={supportLink}
                        onCopyCard={() => copyToClipboard("5041721212076674")}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
