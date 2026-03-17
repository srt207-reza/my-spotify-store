import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ShoppingBag, Sparkles, ShieldCheck, Clock, HeartHandshake } from "lucide-react";

export const metadata = {
    title: "درباره سالونا | رزرو آرایشگاه و فروشگاه آرایشی",
    description:
        "سالونا، همراه شما در مسیر زیبایی. پلتفرم جامع رزرو آنلاین نوبت آرایشگاه‌های زنانه و فروشگاه تخصصی محصولات آرایشی و بهداشتی.",
};

export default function AboutPage() {
    return (
        // تخصیص فونت وزیرمتن و راست‌چین کردن کل صفحه
        <main className="min-h-screen bg-background font-vazir" dir="rtl">
            {/* بخش هیرو (Hero Section) */}
            <section className="container mx-auto px-4 py-16 lg:py-24 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-salona-100 text-salona-700 rounded-full text-sm font-semibold mb-2">
                            داستان سالونا
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground font-iransans leading-tight">
                            تلاقی <span className="text-salona-500">هنر زیبایی</span> و <br />
                            تکنولوژی مدرن
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-lg text-justify">
                            سالونا تنها یک وب‌سایت نیست؛ یک همراه همیشگی برای بانوانی است که به زمان و زیبایی خود اهمیت
                            می‌دهند. ما با درک دغدغه‌های روزمره شما، پلتفرمی را خلق کرده‌ایم که نه‌تنها فرآیند رزرو نوبت
                            در بهترین آرایشگاه‌های زنانه را بی‌دردسر می‌کند، بلکه دسترسی به مرغوب‌ترین محصولات آرایشی و
                            بهداشتی را در یک مکان فراهم آورده است.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/salons"
                                className="bg-salona-500 hover:bg-salona-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-salona-500/30 flex items-center gap-2"
                            >
                                <CalendarDays className="w-5 h-5 ms-2" />
                                رزرو نوبت
                            </Link>
                            <Link
                                href="/shop"
                                className="bg-salona-50 hover:bg-salona-100 text-salona-600 border border-salona-200 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5 ms-2" />
                                فروشگاه محصولات
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                        {/* در پروژه واقعی از عکس با کیفیت خودتان استفاده کنید */}
                        <Image
                            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop"
                            alt="سالن زیبایی سالونا"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-6 right-6 text-white">
                            <p className="text-2xl font-bold font-iransans">سالونا</p>
                            <p className="text-sm opacity-90">تجربه متفاوت زیبایی</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* بخش خدمات اصلی (Core Services) */}
            <section className="bg-salona-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 font-iransans mb-4">
                            ما چه کاری انجام می‌دهیم؟
                        </h2>
                        <p className="text-gray-600">
                            سالونا دو بال قدرتمند برای پرواز به سوی زیبایی دارد. ما خدمات حضوری و محصولات خانگی را به
                            یکدیگر پیوند داده‌ایم.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* کارت رزرو */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-salona-100">
                            <div className="w-14 h-14 bg-salona-100 text-salona-500 rounded-2xl flex items-center justify-center mb-6">
                                <CalendarDays className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-iransans">مدیریت نوبت‌دهی آرایشگاه‌ها</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                دیگر نیازی به تماس‌های مکرر و هماهنگی‌های زمان‌بر نیست. با سالونا می‌توانید تقویم کاری
                                بهترین سالن‌های زیبایی را مشاهده کنید، نمونه کارها را ببینید و در ساعت دلخواه خود،
                                نوبتتان را قطعی کنید.
                            </p>
                        </div>

                        {/* کارت فروشگاه */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-salona-100">
                            <div className="w-14 h-14 bg-salona-100 text-salona-500 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingBag className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-iransans">فروشگاه تخصصی محصولات</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                مراقبت از زیبایی پس از خروج از سالن متوقف نمی‌شود. ما مجموعه‌ای از بهترین و معتبرترین
                                برندهای آرایشی، مراقبت از پوست و مو را با ضمانت اصالت کالا برای شما گردآوری کرده‌ایم.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* بخش ارزش‌های کلیدی (Core Values) */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 font-iransans mb-4">چرا سالونا را انتخاب کنید؟</h2>
                    <div className="w-24 h-1 bg-salona-300 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: <Clock className="w-6 h-6" />,
                            title: "صرفه‌جویی در زمان",
                            desc: "رزرو سریع در کمتر از ۲ دقیقه و ارسال فوری محصولات به سراسر کشور.",
                        },
                        {
                            icon: <ShieldCheck className="w-6 h-6" />,
                            title: "تضمین اصالت",
                            desc: "تمامی محصولات فروشگاه و خدمات سالن‌ها مورد تایید و دارای ضمانت هستند.",
                        },
                        {
                            icon: <Sparkles className="w-6 h-6" />,
                            title: "تنوع بی‌نظیر",
                            desc: "دسترسی به صدها سالن زیبایی و هزاران محصول آرایشی در یک پلتفرم.",
                        },
                        {
                            icon: <HeartHandshake className="w-6 h-6" />,
                            title: "پشتیبانی دلسوزانه",
                            desc: "تیم پشتیبانی سالونا در تمام مراحل رزرو و خرید در کنار شماست.",
                        },
                    ].map((item, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-gray-50 group-hover:bg-salona-500 group-hover:text-white text-salona-500 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm">
                                {item.icon}
                            </div>
                            <h4 className="text-lg font-bold mb-2 font-iransans text-gray-800">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* بخش دعوت به اقدام (Call to Action) */}
            <section className="container mx-auto px-4 pb-20">
                <div className="bg-gradient-to-r from-salona-600 to-salona-400 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-xl shadow-salona-500/20">
                    {/* افکت‌های پس‌زمینه تزئینی */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl md:text-4xl font-bold font-iransans mb-6 relative z-10 text-shadow-gray">
                        آماده‌اید تا سبک جدیدی از زیبایی را تجربه کنید؟
                    </h2>
                    <p className="text-salona-50 mb-10 max-w-2xl mx-auto text-lg relative z-10">
                        همین حالا به جمع هزاران کاربر سالونا بپیوندید. نوبت خود را رزرو کنید یا سبد خریدتان را از
                        محصولات شگفت‌انگیز پر کنید.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link
                            href="/register"
                            className="bg-white text-salona-600 px-8 py-3 rounded-xl font-bold hover:bg-salona-50 transition-colors shadow-lg"
                        >
                            عضویت در سالونا
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border border-white/50 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
                        >
                            تماس با ما
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
