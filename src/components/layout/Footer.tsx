import Link from "next/link";
import { Instagram, Send, Phone, MapPin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-primary">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* ستون اول: درباره فروشگاه */}
                    <div>
                        <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">
                            SALONA<span className="text-primary">.</span>
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400 mb-6">
                            فروشگاه اینترنتی سالونا، مرجع تخصصی بررسی و خرید آنلاین محصولات آرایشی، بهداشتی و زیبایی. با
                            تضمین اصالت کالا و ارسال سریع به سراسر ایران.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* ستون دوم: دسترسی سریع */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">دسترسی سریع</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li>
                                <Link href="/products" className="hover:text-primary transition-colors">
                                    لیست محصولات
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="hover:text-primary transition-colors">
                                    دسته‌بندی‌ها
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">
                                    مجله زیبایی سالونا
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    درباره ما
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    تماس با ما
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ستون سوم: خدمات مشتریان */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">خدمات مشتریان</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li>
                                <Link href="/faq" className="hover:text-primary transition-colors">
                                    سوالات متداول
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">
                                    قوانین و مقررات
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">
                                    حریم خصوصی
                                </Link>
                            </li>
                            <li>
                                <Link href="/return-policy" className="hover:text-primary transition-colors">
                                    رویه بازگرداندن کالا
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-primary transition-colors">
                                    نحوه ارسال سفارشات
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ستون چهارم: اطلاعات تماس */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">ارتباط با ما</h4>
                        <ul className="flex flex-col gap-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span className="leading-relaxed">
                                    ایران، ساوه، مطهری 41، ساختمان هما، طبقه 6 ، واحد 21
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span dir="ltr">086 - 9100 9185</span>
                            </li>
                            {/* <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span dir="ltr">021 - 9999 9999</span>
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* کپی رایت */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} فروشگاه سالونا. تمامی حقوق محفوظ است.</p>
                    <p className="mt-2 md:mt-0">طراحی و توسعه با ❤️</p>
                </div>
            </div>
        </footer>
    );
};
