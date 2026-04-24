"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Mail, Clock, CreditCard, AlertCircle, LayoutDashboard, Search, Filter, Lock, Calendar } from "lucide-react";

type Order = {
    id: string;
    planType: "individual" | "family";
    planId: string;
    planTitle: string;
    price: number;
    fullNameEn: string;
    password?: string;
    dateOfBirth: string;
    spotifyEmail: string;
    status: string;
    createdAt: string;
};

export default function ClientOrders({ orders }: { orders: Order[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "individual" | "family">("all");

    const formatJalali = (dateString: string) => {
        if (!dateString) return "نامشخص";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const totalOrders = orders.length;
    const totalIncome = orders.reduce((acc, order) => acc + (order.price || 0), 0);

    // نسخه اصلاح شده و ایمن جستجو
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchFilter = activeFilter === "all" || order.planType === activeFilter;

            if (!searchTerm.trim()) return matchFilter;

            const searchLower = searchTerm.toLowerCase().trim();
            const matchSearch =
                (order.id || "").toLowerCase().includes(searchLower) ||
                (order.fullNameEn || "").toLowerCase().includes(searchLower) ||
                (order.spotifyEmail || "").toLowerCase().includes(searchLower) ||
                (order.planTitle || "").toLowerCase().includes(searchLower);

            return matchFilter && matchSearch;
        });
    }, [orders, searchTerm, activeFilter]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 lg:p-12 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-slate-900/80 border border-slate-800/60 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1ED760]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-gradient-to-br from-[#1ED760]/20 to-blue-500/20 p-4 rounded-2xl text-[#1ED760] border border-[#1ED760]/20 shadow-inner">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400">
                                داشبورد سفارشات اسپاتیفای
                            </h1>
                            <p className="text-slate-400 text-sm mt-1.5 font-medium">
                                مدیریت، پیگیری و گزارش‌گیری یکپارچه
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full xl:w-auto relative z-10">
                        <div className="bg-slate-800/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/80 flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                کل درآمد (تومان)
                            </p>
                            <p className="font-black text-xl text-[#1ED760]">{totalIncome.toLocaleString("fa-IR")}</p>
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700/80 flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                کل سفارشات
                            </p>
                            <p className="font-black text-xl text-white">{totalOrders.toLocaleString("fa-IR")}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#1ED760] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="جستجو نام، ایمیل یا پلن..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/80 border border-slate-700/50 text-white text-sm rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-[#1ED760]/50 focus:border-[#1ED760]/50 transition-all placeholder:text-slate-500 shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-2 px-3 text-slate-400">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">فیلتر:</span>
                        </div>
                        <div className="flex gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
                            {(["all", "individual", "family"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                        activeFilter === type
                                            ? type === "individual"
                                                ? "bg-[#1ED760]/20 text-[#1ED760] shadow-sm"
                                                : type === "family"
                                                  ? "bg-blue-500/20 text-blue-400 shadow-sm"
                                                  : "bg-white/10 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                    }`}
                                >
                                    {type === "all"
                                        ? "همه پلن‌ها"
                                        : type === "individual"
                                          ? "شخصی (Individual)"
                                          : "فمیلی (Family)"}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-slate-900/30 border border-slate-800/50 rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">نتیجه‌ای یافت نشد!</h3>
                        <p className="text-slate-500">سفارشی با این مشخصات در سیستم ثبت نشده است.</p>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const isFamily = order.planType === "family";
                                const themeColor = isFamily ? "text-blue-400" : "text-[#1ED760]";
                                const bgGradient = isFamily
                                    ? "from-blue-500/10 to-transparent"
                                    : "from-[#1ED760]/10 to-transparent";
                                const borderTheme = isFamily ? "border-blue-500/20" : "border-[#1ED760]/20";
                                const ProductIcon = isFamily ? Users : User;

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        transition={{ duration: 0.3, layout: { duration: 0.3 } }}
                                        className="group flex flex-col h-full bg-slate-900/80 border border-slate-800/80 rounded-[1.5rem] overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/50 hover:-translate-y-1"
                                    >
                                        <div
                                            className={`bg-gradient-to-b ${bgGradient} border-b ${borderTheme} p-5 flex justify-between items-center relative overflow-hidden`}
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div
                                                    className={`p-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md shadow-sm border border-white/5 ${themeColor}`}
                                                >
                                                    <ProductIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="block text-[11px] font-bold tracking-wider text-slate-400 mb-0.5">
                                                        ID: {(order.id || "").slice(-8).toUpperCase()}
                                                    </span>
                                                    <span className={`text-sm font-black tracking-wide ${themeColor}`}>
                                                        {isFamily ? "اسپاتیفای فمیلی" : "اسپاتیفای شخصی"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/20 relative z-10 shadow-sm">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {order.status === "pending_payment" ? "در انتظار پرداخت" : order.status}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4 relative flex-1">
                                            <div className="bg-[#0b0f19] p-4 rounded-2xl border border-slate-800 flex justify-between items-center shadow-inner group-hover:border-slate-700 transition-colors">
                                                <div className="flex items-center gap-2.5 text-slate-300 font-medium text-sm">
                                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                                    <span className="truncate max-w-[120px] sm:max-w-max">
                                                        {order.planTitle || "ثبت نشده"}
                                                    </span>
                                                </div>
                                                <div className="font-black font-bold text-white bg-slate-800/50 px-3 py-1 rounded-lg">
                                                    {(order.price || 0).toLocaleString("fa-IR")}{" "}
                                                    <span className="text-[10px] text-slate-400 font-normal">
                                                        تومان
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2 px-1">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span className="text-slate-200 font-medium" dir="ltr">
                                                        {order.fullNameEn || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span
                                                        className="text-slate-300 tracking-widest text-xs md:text-sm"
                                                        dir="ltr"
                                                    >
                                                        {order.dateOfBirth || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                                        <Mail className="w-4 h-4 text-[#1ED760]" />
                                                    </div>
                                                    <span
                                                        className="text-slate-300 truncate text-xs md:text-sm"
                                                        dir="ltr"
                                                    >
                                                        {order.spotifyEmail || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
                                                        <Lock className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span
                                                        className={`tracking-widest text-xs md:text-sm ${order.password ? "text-slate-300" : "text-slate-500"}`}
                                                        dir="ltr"
                                                    >
                                                        {order.password || "بدون کلمه عبور"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-5 py-3.5 bg-[#0b0f19] border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{formatJalali(order.createdAt)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
