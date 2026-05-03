import { Send, ShieldUser } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-store-border bg-store-dark/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-evenly gap-8 text-sm">
                    {/* بخش درباره ما */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">درباره ما</h3>
                        <p className="text-slate-400 leading-relaxed text-justify max-w-xl">
                            ما با ارائه بهترین سرویس‌های دیجیتال و اشتراک‌های قانونی اسپاتیفای در قالب طرح‌های شخصی و
                            فمیلی، تجربه بی‌نظیری از دنیای موسیقی را بدون دغدغه و با بالاترین کیفیت برای شما فراهم
                            می‌کنیم.
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
                                <ShieldUser className="w-5 h-5 text-green-400" /> ارتباط با پشتیبانی
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
