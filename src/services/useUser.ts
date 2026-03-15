import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

// تعریف تایپ‌های مربوط به پروفایل کاربر
export interface UserProfile {
    name: string;
    // در صورت وجود فیلدهای دیگر در ریسپانس (مثل شماره موبایل، آواتار و...)، آن‌ها را اینجا اضافه کنید
}

export type UpdateProfilePayload = {
    name: string;
};

// 1. دریافت اطلاعات کاربر فعلی (GET)
export const useUserProfile = () => {
    return useQuery({
        // استفاده از یک کلید یکتا برای کش کردن اطلاعات کاربر
        queryKey: ["userProfile"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<UserProfile>("/api/users/me");
            return data;
        },
        retry:false
    });
};

// 2. ویرایش اطلاعات کاربر (PUT)
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            const { data } = await axiosInstance.put<UserProfile>("/api/users/me", payload);
            return data;
        },
        onSuccess: () => {
            // پس از ویرایش موفقیت‌آمیز نام، کش مربوط به پروفایل کاربر را باطل می‌کنیم
            // تا اطلاعات جدید بلافاصله از سرور دریافت و در رابط کاربری (UI) بروزرسانی شود
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        retry:false
    });
};
