import { Send, ShieldUser } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-store-border bg-store-dark/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-evenly gap-8 text-sm">
                    {/* بخش درباره ما */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">درباره ما</h3>
                        <p className="text-slate-400 leading-relaxed text-justify max-w-4xl">
                            اسپاتیفای امروز به‌عنوان یکی از محبوب‌ترین و شناخته‌شده‌ترین سرویس‌های پخش موسیقی آنلاین در
                            جهان، تجربه‌ای متفاوت از شنیدن موسیقی، پادکست و محتوای صوتی را برای میلیون‌ها کاربر فراهم
                            کرده است. دسترسی به آرشیوی گسترده از موسیقی‌های روز دنیا، کیفیت پخش بالا و امکانات متنوع،
                            باعث شده اسپاتیفای به انتخاب اول بسیاری از کاربران در سراسر جهان تبدیل شود. با گسترش محبوبیت
                            اسپاتیفای در میان کاربران ایرانی، همواره نیاز به روشی مطمئن، سریع و آسان برای تهیه اشتراک
                            پرمیوم این سرویس وجود داشته است. سرویسی که به‌دلیل محدودیت‌های پرداخت بین‌المللی، تهیه
                            مستقیم اشتراک پرمیوم آن برای بسیاری از کاربران داخل ایران با دشواری همراه بوده است. فروشگاه
                            Get Spotify نیز با درک این نیاز شکل گرفته است تا امکان خرید آسان، مطمئن و سریع اشتراک پرمیوم
                            اسپاتیفای را برای کاربران ایرانی فراهم کند. ما تلاش کرده‌ایم با ارائه پرداخت معتبر ارزی،
                            فعال‌سازی سریع و پشتیبانی مناسب، تجربه‌ای ساده و بدون نگرانی را برای دسترسی به امکانات
                            حرفه‌ای اسپاتیفای فراهم کنیم تا کاربران بتوانند بدون محدودیت، از دنیای موسیقی لذت ببرند.
                        </p>
                    </div>

                    {/* بخش لینک‌های سریع */}
                    {/* <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/spotify/individual" className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2">
                  <Music className="w-4 h-4" /> طرح شخصی اسپاتیفای
                </Link>
              </li>
              <li>
                <Link href="/spotify/family" className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> طرح فمیلی اسپاتیفای
                </Link>
              </li>
            </ul>
          </div> */}

                    {/* بخش پشتیبانی */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">ارتباط با ما</h3>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://t.me/getSpotify_Support"
                                target="_blank"
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Image
                                    src="/assets/images/spotify_style_support_icon.png"
                                    alt="spotify_style_support_icon"
                                    width={20}
                                    height={20}
                                />
                                ارتباط با پشتیبانی
                            </a>
                            <a
                                href="https://t.me/getspotify_ir"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Send className="w-4 h-4 text-green-400" /> کانال اطلاع‌رسانی
                            </a>
                        </div>
                    </div>
                </div>

                {/* کپی رایت */}
                <div className="mt-8 pt-6 border-t border-store-border text-center text-slate-500 text-xs">
                    © {new Date().getFullYear()} تمامی حقوق محفوظ است. طراحی و توسعه برای ارائه بهترین خدمات دیجیتال.
                </div>
            </div>
        </footer>
    );
}
