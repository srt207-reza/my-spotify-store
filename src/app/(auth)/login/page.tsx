import AuthForm from "@/components/auth/AuthForm";
import Image from "next/image";

export const metadata = {
    title: "ورود / ثبت‌نام | سالونا",
    description: "به فروشگاه لوازم آرایشی و بهداشتی سالونا بپیوندید.",
};

export default function LoginPage() {

    return (
        <div className="min-h-1/2 w-full flex bg-salona-50 font-vazir">
            {/* بخش سمت راست: تصویر تزئینی (مخصوص دسکتاپ) */}
            <div className="hidden lg:flex w-1/2 relative bg-salona-200 rounded-2xl overflow-hidden items-center justify-center">
                {/* یک پس‌زمینه گرادینت برای زیبایی بیشتر */}
                <div className="absolute inset-0 bg-linear-to-br from-salona-300/40 to-salona-600/40 z-10 mix-blend-multiply" />

                {/* در اینجا می‌توانید عکس واقعی از محصولات آرایشی قرار دهید */}
                <div className="relative w-full h-full">
                    {/* اگر عکسی در پوشه public دارید آدرس آن را اینجا بگذارید. مثلا /images/auth-bg.jpg */}
                    <div className="absolute inset-0 bg-salona-500/10 backdrop-blur-[2px] z-20" />
                    <Image
                        src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=2071&auto=format&fit=crop"
                        alt="لوازم آرایشی سالونا"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* متن روی تصویر */}
                <div className="absolute z-30 flex flex-col items-center text-white text-center p-12">
                    <h1 className="text-5xl font-bold mb-6 drop-shadow-lg font-vazir">
                        زیبایی شما، <br />
                        تخصص ماست
                    </h1>
                    <p className="text-lg opacity-90 max-w-md drop-shadow-md">
                        با عضویت در سالونا به جدیدترین محصولات آرایشی و بهداشتی اورجینال با بهترین قیمت‌ها دسترسی پیدا
                        کنید.
                    </p>
                </div>
            </div>

            {/* بخش سمت چپ: فرم احراز هویت */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-linear-to-b from-white to-salona-50">
                {/* دایره‌های بلور شده پس‌زمینه برای زیبایی فرم */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-salona-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-salona-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />

                <div className="w-full z-10">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}
