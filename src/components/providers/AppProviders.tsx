"use client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { store } from "@/store";

export default function AppProviders({ children }: { children: ReactNode }) {
    // ساخت QueryClient در داخل کامپوننت برای جلوگیری از تداخل داده‌ها بین کاربران مختلف (SSR)
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // داده‌ها تا 1 دقیقه Fresh در نظر گرفته می‌شوند
                        refetchOnWindowFocus: false, // عدم دریافت مجدد داده با تغییر تب مرورگر
                    },
                },
            }),
    );

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
    );
}
