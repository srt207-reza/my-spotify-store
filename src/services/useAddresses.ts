import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Address } from "@/types/api";

interface AddressesResponse {
    addresses: Address[];
    count: number;
}

type AddressPayload = Omit<Address, "id">;

// 1. دریافت لیست آدرس‌ها
export const useAddresses = () => {
    return useQuery({
        queryKey: ["addresses"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<AddressesResponse>("/api/users/me/addresses");
            return data;
        },
        retry:false
    });
};

// 2. دریافت جزئیات یک آدرس
export const useAddressDetail = (addressId: number) => {
    return useQuery({
        queryKey: ["address", addressId],
        queryFn: async () => {
            const { data } = await axiosInstance.get<Address>(`/api/users/me/addresses/${addressId}`);
            return data;
        },
        enabled: !!addressId,
        retry:false
    });
};

// 3. افزودن آدرس جدید
export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: AddressPayload) => {
            const { data } = await axiosInstance.post("/api/users/me/addresses", payload);
            return data;
        },
        onSuccess: () => {
            // رفرش شدن خودکار لیست آدرس‌ها پس از افزودن موفق
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        retry:false
    });
};

// 4. ویرایش آدرس
export const useUpdateAddress = (addressId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Partial<AddressPayload>) => {
            const { data } = await axiosInstance.put(`/api/users/me/addresses/${addressId}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            queryClient.invalidateQueries({ queryKey: ["address", addressId] });
        },
        retry:false
    });
};

// 5. حذف آدرس
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (addressId: number) => {
            const { data } = await axiosInstance.delete(`/api/users/me/addresses/${addressId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        retry:false
    });
};
