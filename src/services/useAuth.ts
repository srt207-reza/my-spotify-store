import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AuthResponse } from "@/types/api";

// 1. ارسال کد تایید ورود
export const useLoginOtp = () => {
    return useMutation({
        mutationFn: async (phoneNumber: string) => {
            const { data } = await axiosInstance.post("/api/auth/login/otp", { phone_number: phoneNumber });
            return data;
        },
        retry:false
    });
};

// 2. تایید کد ورود و دریافت توکن
export const useVerifyLogin = () => {
    return useMutation({
        mutationFn: async (payload: { phone_number: string; otp_code: string }) => {
            const { data } = await axiosInstance.post<AuthResponse>("/api/auth/login/verify", payload);
            return data;
        },
        retry:false
    });
};

// 3. ثبت نام کاربر جدید
export const useRegister = () => {
    return useMutation({
        mutationFn: async (phoneNumber: string) => {
            const { data } = await axiosInstance.post("/api/auth/register", { phone_number: phoneNumber });
            return data;
        },
        retry:false
    });
};
