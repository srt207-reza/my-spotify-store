import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Product, PaginationMeta } from "@/types/api";

interface ProductsResponse {
    products: Product[];
    pagination: PaginationMeta;
}

interface ProductFilters {
    page?: number;
    per_page?: number;
    category_id?: number;
}

// 1. دریافت لیست محصولات با فیلتر و صفحه‌بندی
export const useProducts = (filters: ProductFilters) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const { data } = await axiosInstance.get<ProductsResponse>("/api/products", {
                params: filters,
            });
            return data;
        },
        retry:false
    });
};

// 2. دریافت جزئیات یک محصول خاص
export const useProductDetail = (productId: string | number) => {
    return useQuery({
        queryKey: ["product", productId],
        queryFn: async () => {
            const { data } = await axiosInstance.get<Product>(`/api/products/${productId}`);
            return data;
        },
        enabled: !!productId, // کوئری فقط زمانی اجرا می‌شود که آیدی محصول وجود داشته باشد
        retry:false
    });
};
