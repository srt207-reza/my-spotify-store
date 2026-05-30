"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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

function filterEnglishOnly(value: string) {
    return value.replace(/[^\x00-\x7F\s]/g, "");
}

function capitalizeEnglishWords(value: string) {
    return value
        .replace(/\s{2,}/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function normalizeNameInput(value: string) {
    return value.replace(/\s{2,}/g, " ");
}

function hasNonEnglishChars(value: string) {
    return /[^\x00-\x7F]/.test(value);
}

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
    const [firstNameEn, setFirstNameEn] = useState("");
    const [lastNameEn, setLastNameEn] = useState("");
    const [nameFocused, setNameFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const nameInitializedRef = useRef(false);

    useEffect(() => {
        if (nameInitializedRef.current) return;

        const fullName = formData.fullNameEn.trim();
        if (!fullName) return;

        const parts = fullName.split(/\s+/).filter(Boolean);
        setFirstNameEn(parts[0] ? capitalizeEnglishWords(parts[0]) : "");
        setLastNameEn(parts.slice(1).join(" ") ? capitalizeEnglishWords(parts.slice(1).join(" ")) : "");
        nameInitializedRef.current = true;
    }, [formData.fullNameEn]);

    const firstNameHasValue = firstNameEn.trim().length > 0;
    const lastNameHasValue = lastNameEn.trim().length > 0;

    const fullNameCombined = [firstNameEn, lastNameEn].filter(Boolean).join(" ").trim();
    const fullNameValid = NAME_REGEX.test(fullNameCombined);

    const firstNameHasNonEnglish = hasNonEnglishChars(firstNameEn);
    const lastNameHasNonEnglish = hasNonEnglishChars(lastNameEn);

    const emailValid = EMAIL_REGEX.test(formData.spotifyEmail.trim());
    const age = getAge(formData.dateOfBirth);
    const ageValid = age !== null && age >= 15;
    const passwordValid = isPasswordValid(formData.password);
    const genderValid = Boolean(formData.gender);

    const showFirstNameRequiredError = submittedStep3 ? !firstNameHasValue : touched.fullNameEn && !firstNameHasValue;
    const showLastNameRequiredError = submittedStep3 ? !lastNameHasValue : touched.fullNameEn && !lastNameHasValue;

    const showFirstNameLanguageError =
        (submittedStep3 || touched.fullNameEn) && firstNameHasValue && firstNameHasNonEnglish;

    const showLastNameLanguageError =
        (submittedStep3 || touched.fullNameEn) && lastNameHasValue && lastNameHasNonEnglish;

    const showNameFormatError =
        (submittedStep3 || touched.fullNameEn) &&
        firstNameHasValue &&
        lastNameHasValue &&
        !fullNameValid &&
        !showFirstNameLanguageError &&
        !showLastNameLanguageError;

    const showEmailError = submittedStep3
        ? !emailValid
        : touched.spotifyEmail && !!formData.spotifyEmail.trim() && !emailValid;

    const showAgeError = submittedStep3 ? !ageValid : touched.dateOfBirth && !!formData.dateOfBirth.trim() && !ageValid;

    const showGenderError = submittedStep3 && !genderValid;

    const showPasswordError = !!formData.password.trim() && !passwordValid && (touched.password || submittedStep3);

    const canSubmit =
        firstNameHasValue &&
        lastNameHasValue &&
        fullNameValid &&
        emailValid &&
        ageValid &&
        (!formData.password || passwordValid) &&
        genderValid;

    const themeBg = "bg-[#1ED760] hover:bg-[#1fdf64]";
    const showNameGuide = nameFocused || !!firstNameEn.trim() || !!lastNameEn.trim();

    const syncFullName = (nextFirst: string, nextLast: string) => {
        const combined = [nextFirst, nextLast].filter(Boolean).join(" ").trim();
        setFormData((prev) => ({
            ...prev,
            fullNameEn: combined,
        }));
    };

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950 space-y-5"
        >
            <div className="rounded-2xl border text-justify border-zinc-800 bg-black/40 p-4 leading-8 sm:p-5">
                لطفاً اطلاعات حساب کاربری اسپاتیفای خود را با دقت وارد بفرمایید. اشتراک پرمیوم شما بر اساس این اطلاعات
                فعال یا تمدید خواهد شد، بنابراین از صحت اطلاعات وارد شده اطمینان حاصل نمایید.
            </div>

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
                        setFormData((prev) => ({
                            ...prev,
                            spotifyEmail: filterEnglishOnly(e.target.value),
                        }));
                    }}
                    className="w-full border border-[#282828] bg-[#121212] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                    placeholder="example@gmail.com"
                    dir="ltr"
                />
                {showEmailError && (
                    <p className="text-xs mt-2 text-red-400">
                        لطفاً آدرس ایمیل حساب کاربری اسپاتیفای را در قالب صحیح، مطابق نمونه (example@mail.com) وارد
                        نمایید.
                    </p>
                )}
                <p className="text-xs text-slate-500 mt-2">توجه: اشتراک دقیقاً روی همین ایمیل فعال خواهد شد.</p>
            </div>

            <div dir="ltr">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div dir="rtl">
                        <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                            <User className="w-4 h-4" /> نام <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={firstNameEn}
                            maxLength={50}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                            onChange={(e) => {
                                setTouched((prev) => ({ ...prev, fullNameEn: true }));

                                const nextFirst = capitalizeEnglishWords(normalizeNameInput(e.target.value));
                                setFirstNameEn(nextFirst);
                                syncFullName(nextFirst, lastNameEn);
                            }}
                            className="w-full border border-[#282828] bg-[#121212] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                            placeholder="Mohammadreza"
                            dir="ltr"
                            autoComplete="given-name"
                        />
                        {showFirstNameRequiredError && <p className="text-xs mt-2 text-red-400">نام خالی است.</p>}
                        {showFirstNameLanguageError && (
                            <p className="text-xs mt-2 text-red-400">فقط حروف انگلیسی وارد کنید.</p>
                        )}
                    </div>

                    <div dir="rtl">
                        <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                            <User className="w-4 h-4" /> نام‌خانوادگی <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lastNameEn}
                            maxLength={50}
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                            onChange={(e) => {
                                setTouched((prev) => ({ ...prev, fullNameEn: true }));

                                const nextLast = capitalizeEnglishWords(normalizeNameInput(e.target.value));
                                setLastNameEn(nextLast);
                                syncFullName(firstNameEn, nextLast);
                            }}
                            className="w-full border border-[#282828] bg-[#121212] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                            placeholder="Rahimizadeh"
                            dir="ltr"
                            autoComplete="family-name"
                        />
                        {showLastNameRequiredError && (
                            <p className="text-xs mt-2 text-red-400">نام‌خانوادگی خالی است.</p>
                        )}
                        {showLastNameLanguageError && (
                            <p className="text-xs mt-2 text-red-400">فقط حروف انگلیسی وارد کنید.</p>
                        )}
                        {showNameFormatError && (
                            <p className="text-xs mt-2 text-red-400">
                                نام باید فقط با حروف انگلیسی و حداقل شامل نام و نام‌خانوادگی باشد.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <BirthDatePicker
                    value={formData.dateOfBirth}
                    onChange={(val) => {
                        setTouched((prev) => ({ ...prev, dateOfBirth: true }));
                        setFormData((prev) => ({ ...prev, dateOfBirth: val }));
                    }}
                />
                {showAgeError && (
                    <p className="text-xs mt-2 text-red-400">
                        طبق قوانین اسپاتیفای، حداقل سن لازم برای ایجاد حساب کاربری اسپاتیفای ۱۵ سال می‌باشد.
                    </p>
                )}
            </div>

            <GenderSelector
                value={formData.gender}
                onChange={(value: Gender) => {
                    setTouched((prev) => ({ ...prev, gender: true }));
                    setFormData((prev) => ({ ...prev, gender: value }));
                }}
                showError={showGenderError}
            />

            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Lock className="w-4 h-4" /> کلمه عبور حساب کاربری اسپاتیفای
                </label>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                            setTouched((prev) => ({ ...prev, password: true }));
                            setFormData((prev) => ({
                                ...prev,
                                password: filterEnglishOnly(e.target.value),
                            }));
                        }}
                        className={`${!formData.password ? "text-right" : ""} w-full border border-[#282828] bg-[#121212] rounded-xl pl-4 py-3 pr-10 text-white focus:outline-none focus:border-[#1ED760]`}
                        placeholder="در صورتی که با استفاده از آدرس ایمیل مدنظر حساب کاربری اسپاتیفای ایجاد نشده است، کلمه‌عبور پیشنهادی را وارد بفرمایید"
                        dir="ltr"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        aria-label={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                        title={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {formData.password.length > 0 && (
                    <div className="mt-3 space-y-2 text-sm">
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
                        لطفاً کلمه‌عبور حساب کاربری اسپاتیفای را در قالب صحیح، مطابق شرایط فوق وارد نمایید.
                    </p>
                )}

                {showPasswordError && (
                    <p className="text-xs mt-2 text-red-400">
                        کلمه‌عبور باید حداقل ۱۰ کارکتر داشته باشد و شامل ۱ حرف و ۱ عدد یا کاراکتر خاص باشد.
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
                        "تأیید اطلاعات و پرداخت"
                    )}
                </button>
            </div>
        </motion.div>
    );
}
