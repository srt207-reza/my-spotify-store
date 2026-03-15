import type { Metadata } from "next";
import AppProviders from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "فروشگاه سالونا | خرید لوازم آرایشی و بهداشتی",
    description: "بهترین و باکیفیت‌ترین لوازم آرایشی و بهداشتی را با سالونا تجربه کنید.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // ۱. اضافه شدن suppressHydrationWarning به html
        <html lang="fa" dir="rtl" suppressHydrationWarning>
            {/* ۲. اضافه شدن suppressHydrationWarning به body */}
            {/* ۳. اصلاح فونت از font-vazir به font-iransans */}
            <body
                className="min-h-screen bg-background flex flex-col font-iransans text-foreground"
                suppressHydrationWarning
            >
                <AppProviders>
                    <Header />

                    {/* کانتینر کلی پروژه برای قرارگیری یکپارچه محتوا */}
                    <main className="grow flex flex-col">
                        <div className="container py-8 pt-28 grow">{children}</div>
                    </main>

                    <Footer />
                    <Toaster />
                </AppProviders>
            </body>
        </html>
    );
}
