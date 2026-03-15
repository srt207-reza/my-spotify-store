import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/api";

interface CategoriesResponse {
    categories: Category[];
    total_categories: number;
}

// 1. دریافت کل درخت دسته‌بندی‌ها
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<CategoriesResponse>("/api/categories");
            return data;
        },
        staleTime: 5 * 60 * 1000, // دسته‌بندی‌ها معمولا دیر تغییر می‌کنند، ۵ دقیقه کش می‌کنیم
        retry:false
    });
};
