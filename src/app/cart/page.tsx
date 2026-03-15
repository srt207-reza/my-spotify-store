"use client";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/store/slices/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/store";

export default function CartPage() {
    // خواندن اطلاعات سبد خرید از Redux Store
    const { items, totalAmount, totalQuantity } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    // اگر سبد خرید خالی بود
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-salona-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-salona-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">سبد خرید شما خالی است!</h2>
                <p className="text-gray-500 mb-8">می‌توانید برای مشاهده محصولات به صفحه اصلی بروید.</p>
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-salona-500 hover:bg-salona-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-salona-500/30"
                >
                    <ArrowRight className="w-5 h-5" />
                    بازگشت به فروشگاه
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-salona-500" />
                سبد خرید شما
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {totalQuantity} کالا
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* بخش لیست محصولات (سمت راست) */}
                <div className="lg:col-span-8 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-all hover:border-salona-200"
                        >
                            {/* تصویر محصول */}
                            <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-2xl shrink-0 p-2 border border-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>

                            {/* اطلاعات محصول */}
                            <div className="grow w-full text-center sm:text-right">
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{item.name}</h3>
                                <div className="text-salona-600 font-bold text-lg">
                                    {item.price.toLocaleString()}{" "}
                                    <span className="text-sm font-normal text-gray-500">تومان</span>
                                </div>
                            </div>

                            {/* کنترل تعداد و حذف */}
                            <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                <div className="flex items-center gap-3 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-200">
                                    <button
                                        onClick={() => dispatch(addToCart(item))}
                                        className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-salona-500 hover:border-salona-200 border border-transparent transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-red-500 hover:border-red-200 border border-transparent transition-colors"
                                    >
                                        {item.quantity > 1 ? (
                                            <Minus className="w-4 h-4" />
                                        ) : (
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        )}
                                    </button>
                                </div>
                                <div className="hidden sm:block text-xs text-gray-400">
                                    جمع: {(item.price * item.quantity).toLocaleString()} تومان
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* بخش خلاصه سفارش (سمت چپ) */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                            خلاصه سفارش
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>تعداد کالاها</span>
                                <span className="font-medium">{totalQuantity} عدد</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>هزینه ارسال</span>
                                <span className="font-medium text-salona-500">وابسته به آدرس</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8">
                            <span className="text-gray-800 font-bold">مبلغ قابل پرداخت</span>
                            <div className="text-left">
                                <div className="text-2xl font-black text-gray-900 tracking-tight">
                                    {totalAmount.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">تومان</div>
                            </div>
                        </div>

                        {/* <button className="w-full bg-salona-500 hover:bg-salona-600 text-white h-14 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-salona-500/30 active:scale-[0.98] flex items-center justify-center gap-2">
                            ثبت سفارش و پرداخت
                        </button> */}

                        <Link
                            href="/checkout"
                            className="w-full bg-salona-500 hover:bg-salona-600 text-white h-14 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-salona-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            ثبت سفارش و مرحله بعد
                            <ArrowRight className="w-5 h-5 rotate-180" /> {/* آیکون فلش به سمت چپ */}
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            پرداخت امن و تضمین بازگشت وجه
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
