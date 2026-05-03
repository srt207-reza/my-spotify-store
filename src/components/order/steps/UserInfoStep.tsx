"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, AlertCircle, User, Mail, Lock } from "lucide-react";
import BirthDatePicker from "@/components/BirthDatePicker";
import type { FormData, Gender, TouchedState } from "../orderTypes";
import { EMAIL_REGEX, NAME_REGEX, getAge, isPasswordValid } from "@/lib/orderValidation";
import GenderSelector from "../shared/GenderSelector";

type Props = {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
    touched: TouchedState;
    setTouched: Dispatch<SetStateAction<TouchedState>>;
    submittedStep3: boolean;
    setSubmittedStep3: Dispatch<SetStateAction<boolean>>;
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
};

export default function UserInfoStep({
    formData,
    setFormData,
    touched,
    setTouched,
    submittedStep3,
    setSubmittedStep3,
    onBack,
    onSubmit,
    loading,
}: Props) {
    const fullNameValid = NAME_REGEX.test(formData.fullNameEn.trim());
    const emailValid = EMAIL_REGEX.test(formData.spotifyEmail.trim());
    const age = getAge(formData.dateOfBirth);
    const ageValid = age !== null && age >= 15;
    const passwordValid = isPasswordValid(formData.password);
    const genderValid = Boolean(formData.gender);

    // ارورها فقط در صورت سابمیت یا (فوکوس + وارد کردن مقدار اشتباه) نمایش داده می‌شوند
    const showNameError = submittedStep3
        ? !fullNameValid
        : touched.fullNameEn && !!formData.fullNameEn.trim() && !fullNameValid;
    const showEmailError = submittedStep3
        ? !emailValid
        : touched.spotifyEmail && !!formData.spotifyEmail.trim() && !emailValid;
    const showAgeError = submittedStep3 ? !ageValid : touched.dateOfBirth && !!formData.dateOfBirth.trim() && !ageValid;
    const showGenderError = submittedStep3 && !genderValid;

    // پسورد چون اختیاری است، فقط اگر مقداری وارد شده باشد ارور میدهد
    const showPasswordError = !!formData.password.trim() && !passwordValid && (touched.password || submittedStep3);

    const canSubmit = fullNameValid && emailValid && ageValid && (!formData.password || passwordValid) && genderValid;

    const themeBg = "bg-[#1ED760] hover:bg-[#1fdf64]";

    // تابع برای حذف کاراکترهای غیر انگلیسی (فارسی و غیره)
    const filterEnglishOnly = (value: string) => value.replace(/[^\x00-\x7F]/g, "");

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-5"
        >
            <h2 className="text-lg font-medium text-slate-200 mb-4">اطلاعات اکانت خود را وارد کنید:</h2>

            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Mail className="w-4 h-4" /> آدرس ایمیل حساب کاربری اسپاتیفای{" "}
                    <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={formData.spotifyEmail}
                    onChange={(e) => {
                        setTouched((prev) => ({ ...prev, spotifyEmail: true }));
                        setFormData({ ...formData, spotifyEmail: filterEnglishOnly(e.target.value) });
                    }}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                    placeholder="example@gmail.com"
                    dir="ltr"
                />
                {showEmailError && <p className="text-xs mt-2 text-red-400">ایمیل وارد شده معتبر نیست.</p>}
                <p className="text-xs text-slate-500 mt-2">توجه: اشتراک دقیقاً روی همین ایمیل فعال خواهد شد.</p>
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <User className="w-4 h-4" /> نام و نام خانوادگی (انگلیسی) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.fullNameEn}
                    maxLength={50}
                    onChange={(e) => {
                        setTouched((prev) => ({ ...prev, fullNameEn: true }));
                        setFormData({ ...formData, fullNameEn: filterEnglishOnly(e.target.value) });
                    }}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                    placeholder="e.g. John Doe"
                    dir="ltr"
                />
                {showNameError && (
                    <p className="text-xs mt-2 text-red-400">
                        نام باید فقط با حروف انگلیسی و حداقل شامل نام و نام خانوادگی باشد.
                    </p>
                )}
            </div>

            <div>
                <BirthDatePicker
                    value={formData.dateOfBirth}
                    onChange={(val) => {
                        setTouched((prev) => ({ ...prev, dateOfBirth: true }));
                        setFormData({ ...formData, dateOfBirth: val });
                    }}
                />
                {showAgeError && (
                    <p className="text-xs mt-2 text-red-400">
                        شما برای ایجاد یک حساب کاربری اسپاتیفای خیلی جوان هستید. حداقل سن لازم: ۱۵ سال
                    </p>
                )}
            </div>

            <GenderSelector
                value={formData.gender}
                onChange={(value: Gender) => {
                    setTouched((prev) => ({ ...prev, gender: true }));
                    setFormData({ ...formData, gender: value });
                }}
                showError={showGenderError}
            />

            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Lock className="w-4 h-4" /> کلمه عبور حساب کاربری اسپاتیفای
                </label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                        setTouched((prev) => ({ ...prev, password: true }));
                        setFormData({ ...formData, password: filterEnglishOnly(e.target.value) });
                    }}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                    placeholder="در صورت نداشتن حساب کاربری اسپاتیفای خالی بگذارید"
                    dir="ltr"
                />

                {/* چک‌لیست پسورد فقط زمانی نمایش داده می‌شود که کاربر شروع به تایپ کند */}
                {formData.password.length > 0 && (
                    <div className="mt-3 space-y-2 text-sm">
                        {/* شرط ۱: حداقل ۱۰ کاراکتر */}
                        <div className="flex items-center gap-2">
                            {formData.password.length >= 10 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={formData.password.length >= 10 ? "text-green-400" : "text-slate-400"}>
                                حداقل 10 کاراکتر
                            </span>
                        </div>

                        {/* شرط ۲: حداقل ۱ حرف */}
                        <div className="flex items-center gap-2">
                            {/[A-Za-z]/.test(formData.password) ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={/[A-Za-z]/.test(formData.password) ? "text-green-400" : "text-slate-400"}>
                                شامل حداقل 1 حرف
                            </span>
                        </div>

                        {/* شرط ۳: حداقل ۱ عدد یا کاراکتر خاص */}
                        <div className="flex items-center gap-2">
                            {/[0-9\W_]/.test(formData.password) ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={/[0-9\W_]/.test(formData.password) ? "text-green-400" : "text-slate-400"}>
                                شامل 1 عدد یا کاراکتر خاص (& ! ? # @)
                            </span>
                        </div>
                    </div>
                )}

                {showPasswordError && (
                    <p className="text-xs mt-2 text-red-400">
                        رمز عبور باید حداقل 10 کاراکتر داشته باشد و شامل یک حرف و یک عدد یا کاراکتر خاص باشد.
                    </p>
                )}

                {!formData.password && !submittedStep3 && (
                    <p className="text-xs mt-2 text-slate-500">
                        این فیلد اختیاری است، اما اگر وارد شود باید فرمت درست داشته باشد.
                    </p>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onBack}
                    className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    بازگشت
                </button>
                <button
                    onClick={() => {
                        setSubmittedStep3(true);
                        if (canSubmit) onSubmit();
                    }}
                    disabled={loading || !canSubmit}
                    className={`flex-1 cursor-pointer py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${themeBg}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                        "تایید اطلاعات و رفتن به نحوه پرداخت"
                    )}
                </button>
            </div>
        </motion.div>
    );
}
