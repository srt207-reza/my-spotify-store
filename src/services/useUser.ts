import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

// تعریف تایپ‌های مربوط به پروفایل کاربر
export interface UserProfile {
    name: string;
    // در صورت وجود فیلدهای دیگر در ریسپانس (مثل شماره موبایل، آواتار و...)، آن‌ها را اینجا اضافه کنید
}

export type UpdateProfilePayload = {
    name: string;
};

// 1. دریافت اطلاعات کاربر فعلی (GET)
// پارامتر isAuthenticated اضافه شد تا اجرای ریکوئست را کنترل کند
export const useUserProfile = (isAuthenticated: boolean = true) => {
    return useQuery({
        // استفاده از یک کلید یکتا برای کش کردن اطلاعات کاربر
        queryKey: ["userProfile"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<UserProfile>("/api/users/me");
            return data;
        },
        // تا زمانی که isAuthenticated برابر با false باشد، این ریکوئست به سمت سرور ارسال نمی‌شود
        enabled: isAuthenticated,
        retry: false,
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
        retry: false,
    });
};

export const useUploadProfilePicture = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const bodyFormData = new FormData();
            if (file) bodyFormData.append("profile_picture", file);
            return await axiosInstance.post("/upload_profile_picture", bodyFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: (response) => {
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message ?? "تصویر پروفایل با موفقیت به روز رسانی شد");
            }
        },
    });
};
export const useDeleteProfilePicture = () => {
    return useMutation({
        mutationFn: async () => await axiosInstance.delete(`/delete_profile_picture`),
        onSuccess: (response) => {
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message ?? "تصویر پروفایل با موفقیت حذف گردید");
            }
        },
    });
};
