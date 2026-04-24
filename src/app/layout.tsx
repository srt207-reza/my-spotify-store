import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css"; // مسیر globals.css خود را در صورت نیاز اصلاح کنید
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "فروشگاه محصولات دیجیتال | اسپاتیفای و VPN",
  description: "خرید اشتراک پریمیوم اسپاتیفای و سرویس‌های پرسرعت VPN با بهترین قیمت، تحویل آنی و پشتیبانی تلگرامی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body cz-shortcut-listen="true" className="flex flex-col min-h-screen bg-store-dark text-slate-100 antialiased selection:bg-store-success/30 selection:text-store-success">
        {/* هدر سایت */}
        <Header />
        
        {/* محتوای اصلی صفحات (پایین‌تر از هدر فیکس شده قرار می‌گیرد) */}
        <main className="grow pt-24 pb-10 px-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
          {children}
        </main>

        {/* فوتر سایت */}
        <Footer />

        {/* سیستم نمایش نوتیفیکیشن‌ها */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
              fontFamily: 'inherit'
            },
          }} 
        />
      </body>
    </html>
  );
}
