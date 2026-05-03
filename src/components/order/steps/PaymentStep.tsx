"use client";

import { motion } from "framer-motion";
import { CreditCard, Copy, Send, CheckCircle2 } from "lucide-react";

type Props = {
    orderId: string;
    price: number;
    supportLink: string;
    onCopyCard: () => void;
};

export default function PaymentStep({ orderId, price, supportLink, onCopyCard }: Props) {
    return (
        <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
        >
            <div className="w-20 h-20 bg-[#1ED760]/10 text-[#1ED760] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-white">سفارش با موفقیت ثبت شد!</h2>

            <p className="text-slate-400">
                کد پیگیری شما:{" "}
                <span className="font-mono text-white bg-slate-800 px-2 py-1 rounded">{orderId}</span>
            </p>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 relative overflow-hidden mt-8">
                <CreditCard className="absolute -right-4 -top-4 w-32 h-32 text-slate-700/30 rotate-12" />
                <div className="relative z-10 space-y-4">
                    <p className="text-slate-400 text-sm text-right">
                        لطفا مبلغ{" "}
                        <strong className="text-white">{price.toLocaleString("fa-IR")} تومان</strong>{" "}
                        را به کارت زیر واریز نمایید:
                    </p>

                    <div className="flex flex-col items-center justify-center bg-black/30 p-5 rounded-xl backdrop-blur-sm border border-slate-700/50 text-center">
                        <span className="text-xl md:text-2xl font-mono text-white tracking-widest">
                            6037-9981-4892-7014
                        </span>

                        <button
                            onClick={onCopyCard}
                            className="mt-4 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            کپی شماره کارت
                        </button>
                    </div>

                    <p className="text-slate-400 text-sm text-right">به نام: مائده شعاعی - بانک ملی</p>
                </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-4 mt-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                    پس از پرداخت، لطفاً{" "}
                    <span className="text-red-500">
                        <strong>تصویر رسید واریزی</strong> را به همراه کد پیگیری به پشتیبانی تلگرام ما ارسال کنید
                    </span>{" "}
                    تا اکانت شما در کمتر از ۲۴ ساعت پریمیوم شود.
                </p>
                <a
                    href={supportLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 bg-[#2AABEE] hover:bg-[#2298D6]"
                >
                    <Send className="w-5 h-5" /> ارسال رسید به پشتیبانی تلگرام
                </a>
            </div>
        </motion.div>
    );
}