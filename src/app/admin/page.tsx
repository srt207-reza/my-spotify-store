import fs from "fs";
import path from "path";
import ClientOrders from "./ClientOrders";
import Link from "next/link";
import { ShieldAlert, Home } from "lucide-react"; // اضافه کردن آیکون‌های زیبا

// غیرفعال کردن کش برای این صفحه تا همیشه جدیدترین سفارشات لود شوند
export const dynamic = "force-dynamic";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminPage(props: Props) {
    const searchParams = await props.searchParams;
    const secret = searchParams?.secret;

    // رمز عبور ساده برای ورود به پنل
    const ADMIN_SECRET = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3Q3";

    // بررسی صحت رمز عبور
    if (secret !== ADMIN_SECRET) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
                
                {/* افکت‌های پس‌زمینه (هاله‌های نورانی) */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-rose-600/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">
                    {/* حاشیه درخشان دور کارت */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500/30 to-rose-600/10 rounded-[2rem] blur opacity-75"></div>
                    
                    {/* کارت اصلی */}
                    <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-red-500/20 rounded-[2rem] p-8 md:p-10 shadow-2xl text-center">
                        
                        {/* آیکون هشدار با افکت پالس */}
                        <div className="relative mx-auto w-20 h-20 mb-6">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-75"></div>
                            <div className="relative flex items-center justify-center w-full h-full bg-slate-900 border border-red-500/30 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                <ShieldAlert className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        {/* متن‌ها */}
                        <h1 className="text-3xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-600">
                            دسترسی غیرمجاز
                        </h1>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-8">
                            متاسفانه شما مجوز لازم برای مشاهده این بخش را ندارید. 
                            برای ورود به پنل مدیریت، به لینک اختصاصی مدیریت نیاز است.
                        </p>

                        {/* دکمه بازگشت */}
                        <Link 
                            href="/"
                            className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-300 active:scale-95"
                        >
                            <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            <span className="font-medium">بازگشت به فروشگاه</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // خواندن فایل سفارشات
    const filePath = path.join(process.cwd(), "orders.json");
    let orders = [];

    try {
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf8");
            orders = JSON.parse(fileData);

            // مرتب‌سازی سفارشات از جدیدترین به قدیمی‌ترین
            orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    } catch (error) {
        console.error("خطا در خواندن فایل سفارشات:", error);
    }

    return <ClientOrders orders={orders} />;
}
